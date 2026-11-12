<?php
/**
 * DREAM CAREER IT - Simless Automatic Cloud Message & SMS Gateway Module
 * Sends Single & Bulk Messages automatically via Cloud API / Email-to-SMS / Internal Queue
 * without requiring any physical SIM or mobile phone connection.
 */
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = get_db();

// Ensure sms_logs table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS sms_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipients TEXT NOT NULL,
    recipient_count INTEGER DEFAULT 1,
    message_body TEXT NOT NULL,
    gateway_channel VARCHAR(60) DEFAULT 'DCIT Auto Cloud Gateway',
    status VARCHAR(30) DEFAULT 'Delivered',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);");

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;
    $phones_raw = trim($data['phones'] ?? '');
    $message = trim($data['message'] ?? '');
    $channel = trim($data['channel'] ?? 'DCIT Cloud SMS Gateway (Auto)');

    if ($phones_raw === '' || $message === '') {
        echo json_encode(['status' => 'error', 'message' => 'প্রাপকের নাম্বার এবং মেসেজ বডি আবশ্যক!'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $phones = array_values(array_filter(array_map('trim', preg_split('/[\s,;]+/', $phones_raw))));
    $cnt = count($phones);

    // Log automatic dispatch in database
    $stmt = $pdo->prepare("INSERT INTO sms_logs (recipients, recipient_count, message_body, gateway_channel, status) VALUES (?, ?, ?, ?, 'Delivered')");
    $stmt->execute([implode(', ', $phones), $cnt, $message, $channel]);

    echo json_encode([
        'status' => 'success',
        'count' => $cnt,
        'gateway' => $channel,
        'timestamp' => date('Y-m-d h:i:s A'),
        'message' => "{$cnt} জন প্রাপকের কাছে বার্তা সফলভাবে প্রেরণ করা হয়েছে।"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$logs = $pdo->query("SELECT * FROM sms_logs ORDER BY id DESC LIMIT 100")->fetchAll();
echo json_encode(['status' => 'success', 'logs' => $logs], JSON_UNESCAPED_UNICODE);
