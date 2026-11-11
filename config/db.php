<?php
/**
 * Dream Career IT - Database & Core Configuration
 * Supports BOTH MySQL (XAMPP/cPanel) AND Zero-Config SQLite out of the box!
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
date_default_timezone_set('Asia/Dhaka');

// Database Mode: 'sqlite' (works immediately without setup) or 'mysql' (for cPanel/XAMPP MySQL)
define('DB_DRIVER', getenv('AG_DB_DRIVER') ?: 'sqlite');
define('DB_HOST', getenv('AG_DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('AG_DB_NAME') ?: 'dream_career_it_db');
define('DB_USER', getenv('AG_DB_USER') ?: 'root');
define('DB_PASS', getenv('AG_DB_PASS') ?: '');
define('SQLITE_PATH', __DIR__ . '/../data/dream_career_it.sqlite');

function get_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    try {
        if (DB_DRIVER === 'mysql') {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } else {
            $pdo = new PDO("sqlite:" . SQLITE_PATH, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $pdo->exec("PRAGMA foreign_keys = ON;");
        }
    } catch (PDOException $e) {
        // Auto-fallback to SQLite if MySQL connection fails
        $pdo = new PDO("sqlite:" . SQLITE_PATH, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

function h(?string $str): string {
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

function get_settings(): array {
    static $settings = null;
    if ($settings !== null) {
        return $settings;
    }
    $settings = [];
    try {
        $stmt = get_db()->query("SELECT setting_key, setting_value FROM settings");
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    } catch (Exception $e) {}
    return $settings;
}

function setting(string $key, string $default = ''): string {
    $s = get_settings();
    return isset($s[$key]) && $s[$key] !== '' ? $s[$key] : $default;
}

function set_flash(string $type, string $msg): void {
    $_SESSION['flash'] = ['type' => $type, 'msg' => $msg];
}

function get_flash(): ?array {
    if (!empty($_SESSION['flash'])) {
        $f = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $f;
    }
    return null;
}

function verify_password_custom(string $input, string $stored_hash): bool {
    if (password_verify($input, $stored_hash)) {
        return true;
    }
    if (hash('sha256', $input) === $stored_hash) {
        return true;
    }
    return false;
}

function hash_password_custom(string $input): string {
    return hash('sha256', $input);
}

function is_admin_logged_in(): bool {
    return !empty($_SESSION['admin_id']);
}

function require_admin(): void {
    if (!is_admin_logged_in()) {
        header("Location: login.php");
        exit;
    }
}

function handle_image_upload(string $field_name, string $default_path = 'assets/img/home-icon.png'): string {
    if (!empty($_FILES[$field_name]['name']) && $_FILES[$field_name]['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES[$field_name]['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'];
        if (in_array($ext, $allowed, true) && $_FILES[$field_name]['size'] <= 5 * 1024 * 1024) {
            $new_name = 'upload_' . time() . '_' . mt_rand(1000, 9999) . '.' . $ext;
            $target_dir = __DIR__ . '/../uploads/';
            if (!is_dir($target_dir)) {
                mkdir($target_dir, 0775, true);
            }
            if (move_uploaded_file($_FILES[$field_name]['tmp_name'], $target_dir . $new_name)) {
                return 'uploads/' . $new_name;
            }
        }
    }
    return $default_path;
}

function next_reg_no(): string {
    $stmt = get_db()->query("SELECT reg_no FROM students ORDER BY id DESC LIMIT 1");
    $last = $stmt->fetchColumn();
    $num = $last ? ((int)$last + 1) : 1;
    return str_pad((string)$num, 6, '0', STR_PAD_LEFT);
}

function next_roll_no(): string {
    $stmt = get_db()->query("SELECT COUNT(*) FROM students");
    $cnt = (int)$stmt->fetchColumn() + 1;
    return str_pad((string)$cnt, 2, '0', STR_PAD_LEFT);
}
