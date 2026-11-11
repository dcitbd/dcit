-- ==========================================================
-- DREAM CAREER IT - Complete MySQL Database Dump
-- Phone: 01771770044 | Poduar Bazar, Cumilla
-- ==========================================================

SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS `dream_career_it_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dream_career_it_db`;

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'Administrator',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "admins" VALUES(1,'admin','dc13edubd@gmail.com','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','DR. A.K.M Lokman','Chief Administrator','2026-11-11 16:39:43');
INSERT INTO "admins" VALUES(2,'sagor','gsctcbmcmrjas@gmail.com','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Jainal Abedin (Sagor)','System Admin & Developer','2026-11-11 16:39:43');
CREATE TABLE admissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_no VARCHAR(40) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    father_name VARCHAR(120),
    email VARCHAR(120),
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    school_college VARCHAR(150),
    religion VARCHAR(50) DEFAULT 'Muslim',
    education VARCHAR(80) DEFAULT 'HSC',
    course_name VARCHAR(120) NOT NULL,
    preferred_slot VARCHAR(80) DEFAULT '9:30 AM - 11:00 AM',
    session_quarter VARCHAR(60) DEFAULT 'January to March',
    batch_year INTEGER DEFAULT 2026,
    dob VARCHAR(30),
    document_path VARCHAR(255),
    payment_method VARCHAR(40) DEFAULT 'bKash',
    trx_id VARCHAR(80),
    paid_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Pending',
    enrolled_reg_no VARCHAR(30),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "admissions" VALUES(1,'REG-2026-101','Sadia Afrin','Md. Kamal Uddin','sadia.cumilla@gmail.com','01799112233','Poduar Bazar, Cumilla','Ibne Taimiya School & College','Muslim','HSC','Advance Microsoft Office','9:30 AM - 11:00 AM','January to March',2026,'2004-06-12','','bKash','BK11223344',500,'Pending','','2026-11-11 16:39:43');
INSERT INTO "admissions" VALUES(2,'REG-2026-102','Ariful Islam','Md. Sirajul Islam','ariful.gfx@gmail.com','01855443311','Suagazi, Sadar Dakshin, Cumilla','Cumilla Polytechnic Institute','Muslim','HSC','Graphic Design','11:00 AM - 12:30 PM','January to March',2026,'2003-09-21','','Nagad','NG99887766',1000,'Pending','','2026-11-11 16:39:43');
INSERT INTO "admissions" VALUES(3,'REG-2026-100','Md. Rakibul Hasan','Md. Abdul Karim','rakib.cumilla@gmail.com','01712345678','Poduar Bazar, Bishwo Road, Cumilla','Cumilla Victoria Govt. College','Muslim','HSC','Advance Microsoft Office','8:00 AM - 9:30 AM','January to March',2026,'2002-05-14','','bKash','BK9823412A',1500,'Approved','000002','2026-11-11 16:39:43');
CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cert_no VARCHAR(50) UNIQUE NOT NULL,
    student_id INTEGER,
    reg_no VARCHAR(30) NOT NULL,
    student_name VARCHAR(120) NOT NULL,
    father_name VARCHAR(120),
    mother_name VARCHAR(120),
    course_name VARCHAR(120) NOT NULL,
    batch_year INTEGER DEFAULT 2020,
    session_quarter VARCHAR(60) DEFAULT 'January to March',
    duration VARCHAR(50) DEFAULT '3 Months',
    grade VARCHAR(20) DEFAULT 'A+',
    issue_date DATE NOT NULL,
    verification_code VARCHAR(60) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'Issued',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "certificates" VALUES(1,'DCIT-2020-000001',1,'000001','Jainal Abedin (Sagor)','Faridul Alam','Husneara','Advance Microsoft Office',2020,'January to March','3 Months','A+','2020-04-05','VER-DCIT-000001','Issued','2026-11-11 16:39:43');
INSERT INTO "certificates" VALUES(2,'DCIT-2026-000002',2,'000002','Md. Rakibul Hasan','Md. Abdul Karim','Rokeya Begum','Advance Microsoft Office',2026,'January to March','3 Months','A+','2026-04-10','VER-DCIT-000002','Issued','2026-11-11 16:39:43');
INSERT INTO "certificates" VALUES(3,'DCIT-2026-000003',3,'000003','Nusrat Jahan Mim','Md. Shafiqul Islam','Nasreen Akter','Graphic Design',2026,'January to March','3 Months','A+','2026-04-12','VER-DCIT-000003','Issued','2026-11-11 16:39:43');
INSERT INTO "certificates" VALUES(4,'DCIT-2026-000004',4,'000004','Tanvir Ahmed Chowdhury','Mahbubul Alam','Salma Khatun','Web Design & Development',2026,'January to March','4 Months','A','2026-05-01','VER-DCIT-000004','Issued','2026-11-11 16:39:43');
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_code VARCHAR(30) UNIQUE NOT NULL,
    time_label VARCHAR(80) NOT NULL,
    batch_name VARCHAR(100) NOT NULL,
    session_name VARCHAR(80) DEFAULT 'January to March',
    batch_year INTEGER DEFAULT 2026,
    course_name VARCHAR(120) DEFAULT 'All Courses',
    teacher_name VARCHAR(120) DEFAULT 'DR. A.K.M Lokman',
    room_no VARCHAR(50) DEFAULT 'Lab-01 (2nd Floor)',
    days_of_week VARCHAR(100) DEFAULT 'Sat, Mon, Wed / Sun, Tue, Thu',
    rules_text TEXT,
    max_seats INTEGER DEFAULT 20,
    status VARCHAR(20) DEFAULT 'Active',
    sort_order INTEGER DEFAULT 1
);
INSERT INTO "classes" VALUES(1,'8-9.30','8:00 AM - 9:30 AM','Morning Batch-1','January to March',2026,'Advance Microsoft Office','DR. A.K.M Lokman','Lab-01','Sat, Mon, Wed','ক্লাস শুরু হওয়ার ১০ মিনিট পূর্বে ল্যাবে উপস্থিত থাকতে হবে এবং নির্ধারিত প্র্যাকটিস শিট সম্পন্ন করতে হবে।',20,'Active',1);
INSERT INTO "classes" VALUES(2,'9.30-11','9:30 AM - 11:00 AM','Morning Batch-2','January to March',2026,'Microsoft Office','Jainal Abedin (Sagor)','Lab-01','Sat, Mon, Wed','প্রতি ক্লাসে ইংরেজি ও বাংলা টাইপিং প্র্যাকটিস এবং পূর্ববর্তী ক্লাসের হোমওয়ার্ক জমা দিতে হবে।',20,'Active',2);
INSERT INTO "classes" VALUES(3,'11-12.5','11:00 AM - 12:30 PM','Midday Batch-3','January to March',2026,'Graphic Design','Jainal Abedin (Sagor)','Lab-02','Sun, Tue, Thu','Adobe Illustrator ও Photoshop প্রজেক্ট ফাইল পেনড্রাইভে সংরক্ষণ করতে হবে।',20,'Active',3);
INSERT INTO "classes" VALUES(4,'12.5-2','12:30 PM - 2:00 PM','Afternoon Batch-4','January to March',2026,'Web Design & Development','Jainal Abedin (Sagor)','Lab-02','Sun, Tue, Thu','HTML, CSS, JS এবং PHP কোডিং এসাইনমেন্ট নিয়মিত গিটহাব বা লোকাল সার্ভারে প্র্যাকটিস করতে হবে।',20,'Active',4);
INSERT INTO "classes" VALUES(5,'4-5.5','4:00 PM - 5:30 PM','Afternoon Batch-5','January to March',2026,'Spoken English','DR. A.K.M Lokman','Room-03','Sat, Mon, Wed','ক্লাস চলাকালীন আবশ্যিকভাবে ইংরেজিতে কথা বলার চর্চা করতে হবে।',20,'Active',5);
INSERT INTO "classes" VALUES(6,'5.5-7','5:30 PM - 7:00 PM','Evening Batch-6','January to March',2026,'Advance Microsoft Office','DR. A.K.M Lokman','Lab-01','Sun, Tue, Thu','নিয়মিত উপস্থিতি এবং মাসিক মূল্যায়ন পরীক্ষায় অংশগ্রহণ বাধ্যতামূলক।',20,'Active',6);
INSERT INTO "classes" VALUES(7,'7-8.5','7:00 PM - 8:30 PM','Night Batch-7','January to March',2026,'IELTS Preparation','DR. A.K.M Lokman','Room-03','Sat, Mon, Wed','চাকরিজীবী ও শিক্ষার্থীদের জন্য বিশেষ সান্ধ্যকালীন ব্যাচ; সাপ্তাহিক মক টেস্ট বাধ্যতামূলক।',20,'Active',7);
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    title_bn VARCHAR(150) NOT NULL,
    fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration VARCHAR(50) DEFAULT '3 Months',
    class_duration VARCHAR(50) DEFAULT '1 Hour 30 Minutes',
    weekly_days VARCHAR(50) DEFAULT '3 Days / Week',
    total_classes INTEGER DEFAULT 36,
    has_certificate INTEGER DEFAULT 1,
    short_desc TEXT,
    description_bn TEXT,
    topics_json TEXT,
    syllabus_json TEXT,
    image VARCHAR(255) DEFAULT 'assets/img/course-msoffice.jpg',
    status VARCHAR(20) DEFAULT 'Active',
    sort_order INTEGER DEFAULT 1
);
INSERT INTO "courses" VALUES(1,'msoffice','Microsoft Office','অফিস এপ্লিকেশন কোর্স',1000,'3 Months','1.30 Hours','3 Days / Week',27,0,'MS Office application course only 1000 Taka. Ideal for beginners learning Computer Fundamentals, Typing, MS Word, MS Excel, and Internet.','অফিস এপ্লিকেশন কোর্স, মাত্র ১০০০ টাকা। প্রতি ক্লাস ১.৩০ মিনিট করে। সপ্তাহে (০৩) দিন ক্লাস চলবে। এই কোর্সে সার্টিফিকেট প্রদান করা হয় না। সার্টিফিকেট প্রয়োজন হলে এডভান্স অফিস এপ্লিকেশন কোর্স করতে হবে।','["Fundamental of Computer", "MS Word", "MS Excel", "English and Bangla Typing", "Internet & E-mail", "Online Work"]','[{"section": "Computer Fundamental", "title": "Class 1 - 4", "items": ["Basic concept on Computer", "Use of Keyboard, Mouse & Monitor", "Type Practice English"]}, {"section": "Computer Fundamental", "title": "Class 5", "items": ["Desktop, Icon", "Title Bar, Menu Bars", "Dialog Box, Scroll Bar"]}, {"section": "Computer Fundamental", "title": "Class 6", "items": ["Minimize, Maximize and Close Buttons", "How to Shutdown and Restart", "Create a Folder & Subfolder", "Delete and Rename File/Folder"]}, {"section": "MS Word", "title": "Class 7 - 9", "items": ["Create and Save a file", "Page Setup & Print Preview", "Cut, Copy, Paste & Keyboard Shortcuts", "Find & Replace, Go to Page", "Formatting, Standard & Drawing Toolbars"]}, {"section": "MS Word", "title": "Class 10 - 12", "items": ["Shapes, Line, Rectangle, Oval, Header & Footer", "Insert Symbol, File & Mail Merge Option", "Insert Clip Art, Picture, WordArt & Text Box"]}, {"section": "MS Word", "title": "Class 13 - 15", "items": ["Font Style, Bullets & Numbering, Borders & Shading, Columns", "Word Count, AutoCorrect, Draw & Split Table", "Bangla Type Practice & Exam on MS Word"]}, {"section": "MS Excel", "title": "Class 16 - 19", "items": ["Workbook & Worksheet Basics, Page Setup & Print", "Cut, Copy, Paste, Formula Bar & Comments", "Format Cells, Rows, Columns & Hyperlink", "Functions: Sum, Average, Max, Min, Count & Sheet Protection"]}, {"section": "MS Excel", "title": "Class 20 - 26", "items": ["Complex Calculation using IF, AND, OR conditions", "Result Sheet Calculation", "Wage & Salary with Commission Calculation", "Income Tax & Interest Calculation", "Final Exam on MS Excel"]}, {"section": "Internet & Online Work", "title": "Class 27", "items": ["Internet & Professional E-mail", "Online Job, School/College/University & Scholarship Apply", "Graphics Design & Freelancing Basics"]}]','assets/img/course-msoffice.jpg','Active',1);
INSERT INTO "courses" VALUES(2,'officepro','Advance Microsoft Office','এডভান্স অফিস এপ্লিকেশন কোর্স',1500,'3 Months','1.30 Hours','3 Days / Week',36,1,'Advance MS Office application course only 1500 Taka with FREE Official Certificate. Covers Word, Excel, PowerPoint, Access, Windows Setup & Freelancing.','এডভান্স অফিস এপ্লিকেশন কোর্স, মাত্র ১৫০০ টাকা। এই কোর্সে সার্টিফিকেট ফ্রিতে (ফি ছাড়া) প্রদান করা হয়। প্রতি ক্লাস ১.৩০ মিনিট করে। সপ্তাহে (০৩) দিন ক্লাস চলবে।','["Fundamental of Computer", "Windows Setup & Software Installation", "MS Word", "MS Excel", "MS PowerPoint", "MS Access", "Internet & E-mail", "Online Work & Freelancing Basic"]','[{"section": "Computer Fundamental", "title": "Class 1 - 4", "items": ["Basic concept on Computer", "Use of Keyboard, Mouse & Monitor", "Type Practice English"]}, {"section": "Computer Fundamental", "title": "Class 5", "items": ["Desktop, Icon", "Title Bar, Menu Bars", "Dialog Box, Scroll Bar"]}, {"section": "Computer Fundamental", "title": "Class 6", "items": ["Minimize, Maximize and Close Buttons", "How to Shutdown and Restart", "Create a Folder & Subfolder", "Delete and Rename File/Folder"]}, {"section": "MS Word", "title": "Class 7 - 9", "items": ["Create and Save a file", "Page Setup & Print Preview", "Cut, Copy, Paste & Keyboard Shortcuts", "Find & Replace, Go to Page", "Formatting, Standard & Drawing Toolbars"]}, {"section": "MS Word", "title": "Class 10 - 12", "items": ["Shapes, Line, Rectangle, Oval, Header & Footer", "Insert Symbol, File & Mail Merge Option", "Insert Clip Art, Picture, WordArt & Text Box"]}, {"section": "MS Word", "title": "Class 13 - 15", "items": ["Font Style, Bullets & Numbering, Borders & Shading, Columns", "Word Count, AutoCorrect, Draw & Split Table", "Bangla Type Practice & Exam on MS Word"]}, {"section": "MS Excel", "title": "Class 16 - 19", "items": ["Workbook & Worksheet Basics, Page Setup & Print", "Cut, Copy, Paste, Formula Bar & Comments", "Format Cells, Rows, Columns & Hyperlink", "Functions: Sum, Average, Max, Min, Count & Sheet Protection"]}, {"section": "MS Excel", "title": "Class 20 - 26", "items": ["Complex Calculation using IF, AND, OR conditions", "Result Sheet Calculation", "Wage & Salary with Commission Calculation", "Income Tax & Interest Calculation", "Final Exam on MS Excel"]}, {"section": "MS PowerPoint", "title": "Class 27 - 30", "items": ["Introducing MS PowerPoint, Create, Open & Save Presentation", "Page Setup, Print, Duplicate Slide, Slide Number, Date & Time", "Insert Symbol, Picture, WordArt, Slide Layout & Transitions", "Exam on MS PowerPoint"]}, {"section": "MS Access", "title": "Class 31 - 33", "items": ["Database Objects: Tables, Forms, Queries", "Create Students Database using Wizard", "Exam on MS Access"]}, {"section": "System, Internet & Freelancing", "title": "Class 34 - 36", "items": ["Final Combined Exam", "Windows Operating System & Software Installation", "Internet, Professional E-mail, Job/Admission/Scholarship Apply & Freelancing/Outsourcing"]}]','assets/img/course-office-pro.jpg','Active',2);
INSERT INTO "courses" VALUES(3,'graphic','Graphic Design','গ্রাফিক্স ডিজাইন কোর্স',3000,'3 Months','1.30 Hours','3 Days / Week',36,1,'Professional Graphic Design course only 3000 Taka with Certificate. Master Adobe Illustrator and Adobe Photoshop with real-world projects.','গ্রাফিক্স ডিজাইন কোর্স, মাত্র ৩০০০ টাকা। প্রতি ক্লাস ১.৩০ মিনিট করে। সপ্তাহে (০৩) দিন ক্লাস চলবে। কোর্সের শেষে সার্টিফিকেট প্রদান করা হয়।','["Adobe Illustrator CC", "Adobe Photoshop CC", "Logo & Brand Identity Design", "Poster & Leaflet Design", "Cash Memo & ID/Business Card Design", "T-Shirt Design", "Photo Retouch & Background Removal", "Freelancing Marketplace Guideline"]','[{"section": "Adobe Illustrator", "title": "Vector Design Module", "items": ["Tool Box এর পরিচিতি ও ব্যবহার", "বিভিন্ন ধরনের Text Design", "Professional Logo Design", "Cash Memo তৈরি", "T-Shirt Design", "ব্যানার, লিফলেট ও পোস্টার ডিজাইন", "ID Card, Business Card Design", "Pen Tool এর বিভিন্ন ব্যবহার"]}, {"section": "Adobe Photoshop", "title": "Image Editing & Retouch Module", "items": ["Tool Box এর পরিচিতি ও ব্যবহার", "বিভিন্ন ব্যাকগ্রাউন্ড তৈরি", "Professional Image Editing", "Photo Retouch & Color Correction", "Pen Tool ও Clipping Path এর ব্যবহার", "Layer Mask নিয়ে কাজ", "Background Removal", "লাইভ ক্লায়েন্ট প্রজেক্ট ও ফ্রিল্যান্সিং মার্কেটপ্লেস গাইডলাইন"]}]','assets/img/course-graphic.jpg','Active',3);
INSERT INTO "courses" VALUES(4,'webdesign','Web Design & Development','ওয়েব ডিজাইন ও ডেভেলপমেন্ট',5000,'4 Months','1.30 Hours','3 Days / Week',48,1,'Complete Web Design & Development course only 5000 Taka with Certificate. Learn HTML5, CSS3, JavaScript, Bootstrap, jQuery, PHP, MySQL & Python.','ওয়েব ডিজাইন প্রতি কোর্স, মাত্র ৫০০০ টাকা। প্রতি ক্লাস ১.৩০ মিনিট করে। সপ্তাহে (০৩) দিন ক্লাস চলবে। কোর্সের শেষে সার্টিফিকেট প্রদান করা হয়।','["HTML5 & CSS3 (এইচটিএমএল এবং সিএসএস)", "JavaScript (জাভাস্ক্রিপ্ট)", "Bootstrap (বুটস্ট্র্যাপ)", "jQuery (জে-কুয়েরি)", "PHP (পিএইচপি)", "MySQL / SQL (এসকিউএল)", "Python (পাইথন)", "XML (এক্সএমএল)"]','[{"section": "Frontend Web Design", "title": "HTML5, CSS3, Bootstrap & JS", "items": ["HTML5 Tag, Form, Table & Semantic Layout (এইচটিএমএল)", "CSS3 Styling, Flexbox, Grid & Responsive Design (সিএসএস)", "Bootstrap 5 Framework (বুটস্ট্র্যাপ)", "JavaScript DOM & Interactive UI (জাভাস্ক্রিপ্ট)", "jQuery Plugins & Animations (জে-কুয়েরি)"]}, {"section": "Backend & Database", "title": "PHP, MySQL, Python & XML", "items": ["PHP Dynamic Programming & Control Panel (পিএইচপি)", "MySQL / SQL Database Design & Queries (এসকিউএল)", "Python Programming Basics (পাইথন)", "XML Data Structuring & AJAX (এক্সএমএল)", "Live Full-Stack Project & Hosting Setup"]}]','assets/img/course-webdesign.jpg','Active',4);
INSERT INTO "courses" VALUES(5,'spenglish','Spoken English','স্পোকেন ইংলিশ কোর্স',2000,'3 Months','1.30 Hours','3 Days / Week',36,0,'Spoken English course only 2000 Taka. Build fluency in Spoken, Professional, Business, and Written English.','স্পোকেন ইংলিশ কোর্স, মাত্র ২০০০ টাকা। প্রতি ক্লাস ১.৩০ মিনিট করে। সপ্তাহে (০৩) দিন ক্লাস চলবে। এই কোর্সে সার্টিফিকেট প্রদান করা হয় না।','["Spoken English", "Professional English", "Business English", "Written English"]','[{"section": "Spoken & Fluency", "title": "Spoken & Phonetics Module", "items": ["Daily Life Conversation & Vocabulary", "Pronunciation, Fluency & Public Speaking", "Group Discussion & Presentation Skills"]}, {"section": "Professional & Business English", "title": "Career & Written Module", "items": ["Professional English for Office & Interviews", "Business English & Client Communication", "Written English: Formal Email, CV, Report & Essay Writing"]}]','assets/img/course-spenglish.jpg','Active',5);
INSERT INTO "courses" VALUES(6,'ieilts','IELTS Preparation','আইইএলটিএস (IELTS) কোর্স',4000,'3 Months','1.30 Hours','3 Days / Week',36,0,'IELTS preparation course only 4000 Taka. Intensive training in Listening, Reading, Writing, and Speaking by skilled trainers.','আইইএলটিএস (IELTS) কোর্স, মাত্র ৪০০০ টাকা। প্রতি ক্লাস ১.৩০ মিনিট করে। সপ্তাহে (০৩) দিন ক্লাস চলবে। দক্ষ ট্রেইনার দ্বারা প্রশিক্ষণ দেওয়া হয়।','["IELTS Listening", "IELTS Reading", "IELTS Writing (Task 1 & 2)", "IELTS Speaking & Mock Tests"]','[{"section": "IELTS Core Modules", "title": "Listening & Reading", "items": ["IELTS Listening Strategies & Practice Tests", "IELTS Academic & General Reading Techniques", "Time Management & Question Pattern Analysis"]}, {"section": "IELTS Production Modules", "title": "Writing & Speaking", "items": ["Writing Task 1 (Graph/Chart/Letter) & Task 2 (Essay)", "One-on-One Speaking Mock Tests (Part 1, 2 & 3)", "Full-Length Mock Exams & Band Score Assessment"]}]','assets/img/course-ielts.jpg','Active',6);
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_name VARCHAR(120) NOT NULL,
    sender_email VARCHAR(120) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(150),
    message TEXT NOT NULL,
    target VARCHAR(40) DEFAULT 'Office',
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "messages" VALUES(1,'Mahmudul Hasan','mahmud@gmail.com','01700112233','Course Information','আসসালামু আলাইকুম, আমি Dream Career IT-তে ওয়েব ডিজাইন ও ডেভেলপমেন্ট কোর্সের পরবর্তী ব্যাচে ভর্তি হতে চাই।','Office',0,'2026-11-11 16:39:43');
INSERT INTO "messages" VALUES(2,'Rafiqul Islam','rafiq@yahoo.com','01800998877','Certificate Verification','আমি এডভান্স অফিস কোর্সের ছাত্র ছিলাম, আমার রেজিস্ট্রেশন নম্বর 000001। অনলাইনে সার্টিফিকেট ভেরিফিকেশন সিস্টেমটি খুব চমৎকার হয়েছে!','Designer',1,'2026-11-11 16:39:43');
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_no VARCHAR(40) UNIQUE NOT NULL,
    student_id INTEGER,
    reg_no VARCHAR(30) NOT NULL,
    student_name VARCHAR(120) NOT NULL,
    course_name VARCHAR(120) NOT NULL,
    total_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    due_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_type VARCHAR(50) DEFAULT 'Course Fee',
    payment_method VARCHAR(40) DEFAULT 'Cash',
    trx_id VARCHAR(80),
    payment_date DATE NOT NULL,
    remarks TEXT,
    collected_by VARCHAR(80) DEFAULT 'Admin',
    status VARCHAR(20) DEFAULT 'Paid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "payments" VALUES(1,'INV-2020-001',1,'000001','Jainal Abedin (Sagor)','Advance Microsoft Office',1500,1500,0,'Full Course Fee','Cash','CASH-001','2020-01-10','Paid in full','DR. A.K.M Lokman','Paid','2026-11-11 16:39:43');
INSERT INTO "payments" VALUES(2,'INV-2026-002',2,'000002','Md. Rakibul Hasan','Advance Microsoft Office',1500,1500,0,'Full Course Fee','bKash','BK9823412A','2026-01-15','Full fee received via bKash','DR. A.K.M Lokman','Paid','2026-11-11 16:39:43');
INSERT INTO "payments" VALUES(3,'INV-2026-003',3,'000003','Nusrat Jahan Mim','Graphic Design',3000,2000,1000,'Installment','Nagad','NG7741290X','2026-01-18','1st installment paid, 1000 Tk due','Jainal Abedin (Sagor)','Partial','2026-11-11 16:39:43');
INSERT INTO "payments" VALUES(4,'INV-2026-004',4,'000004','Tanvir Ahmed Chowdhury','Web Design & Development',5000,3500,1500,'Installment','bKash','BK4412983C','2026-01-20','1st installment paid','DR. A.K.M Lokman','Partial','2026-11-11 16:39:43');
INSERT INTO "payments" VALUES(5,'INV-2026-005',5,'000005','Mehedi Hasan Shuvo','Microsoft Office',1000,1000,0,'Full Course Fee','Cash','CASH-005','2026-01-22','Paid at office counter','Jainal Abedin (Sagor)','Paid','2026-11-11 16:39:43');
CREATE TABLE settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT
);
INSERT INTO "settings" VALUES('site_name','Dream Career IT');
INSERT INTO "settings" VALUES('site_subtitle','ড্রিম ক্যারিয়ার আইটি | Poduar Bazar, Cumilla');
INSERT INTO "settings" VALUES('address_bn','ভাই ভাই সুপার মার্কেট, (নতুন পদুয়ার বাজার মসজিদের পাশে), পদুয়ার বাজার, বিশ্বরোড, কুমিল্লা। ফোনঃ- ০১৭৭১৭৭০০৪৪।');
INSERT INTO "settings" VALUES('address_en','Near New Poduar Bazar Mosque, Vai Vai Super Market (2nd Floor), Poduar Bazar, Bishwo Road, Cumilla - 3500.');
INSERT INTO "settings" VALUES('phone_1','01771770044');
INSERT INTO "settings" VALUES('phone_2','01879653143');
INSERT INTO "settings" VALUES('email_1','dc13edubd@gmail.com');
INSERT INTO "settings" VALUES('email_2','gsctcbmcmrjas@gmail.com');
INSERT INTO "settings" VALUES('facebook_url','https://www.facebook.com/amadergrampaduarbazar');
INSERT INTO "settings" VALUES('designer_name','Jainal Abedin (Sagor)');
INSERT INTO "settings" VALUES('designer_fb','https://www.facebook.com/jainalabedin.sagor.143');
INSERT INTO "settings" VALUES('designer_yt','https://www.youtube.com/channel/UCbYQ17l6_mf6ilwlJGvsFSg');
INSERT INTO "settings" VALUES('designer_gh','https://github.com/jasagor2020');
INSERT INTO "settings" VALUES('designer_tw','https://twitter.com/SagorJainal');
INSERT INTO "settings" VALUES('designer_ig','https://www.instagram.com/jasagor2020/');
INSERT INTO "settings" VALUES('designer_li','https://www.linkedin.com/in/jainal-abedin-sagor-448b121a9/');
INSERT INTO "settings" VALUES('notice_text','ভর্তি চলছে! Dream Career IT (ড্রিম ক্যারিয়ার আইটি)-তে Microsoft Office, Advance MS Office, Graphic Design, Web Design, Spoken English এবং IELTS কোর্সে নতুন ব্যাচে ভর্তি চলছে। হটলাইনঃ ০১৭৭১৭৭০০৪৪।');
INSERT INTO "settings" VALUES('stat_experience','11');
INSERT INTO "settings" VALUES('stat_team','10');
INSERT INTO "settings" VALUES('stat_courses','21');
INSERT INTO "settings" VALUES('stat_students','20,785');
INSERT INTO "settings" VALUES('about_intro','In this age of information technology, it is very important for everyone to have knowledge about computers. At Dream Career IT, we believe that everyone deserves practical computer and IT skills. Our goal is to remove any technical or financial barriers that may hinder the acquisition of IT skills and help you build your dream career.');
INSERT INTO "settings" VALUES('mission_text','Dream Career IT is working with a dedicated team to support quality training, practical skills development, freelancing, and employment opportunities for everyone.');
INSERT INTO "settings" VALUES('vision_text','Dream Career IT provides innovative, effective, and well-integrated training opportunities for students who need modern IT skills to achieve career success, independence, and self-reliance.');
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_no VARCHAR(30) UNIQUE NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    name VARCHAR(120) NOT NULL,
    father_name VARCHAR(120),
    mother_name VARCHAR(120),
    present_address TEXT,
    permanent_address TEXT,
    phone VARCHAR(50),
    email VARCHAR(120),
    dob VARCHAR(30),
    religion VARCHAR(50) DEFAULT 'Muslim',
    marital_status VARCHAR(30) DEFAULT 'Un-Married',
    height VARCHAR(20) DEFAULT '5.6"',
    weight VARCHAR(20) DEFAULT '55 KG',
    blood_group VARCHAR(15) DEFAULT 'O+',
    education VARCHAR(150),
    school_college VARCHAR(150),
    experience TEXT,
    course_id INTEGER,
    course_name VARCHAR(120) NOT NULL,
    batch_year INTEGER DEFAULT 2020,
    session_quarter VARCHAR(60) DEFAULT 'January to March',
    batch_type VARCHAR(30) DEFAULT 'New Batch',
    class_slot VARCHAR(80) DEFAULT '8:00 AM - 9:30 AM',
    result_grade VARCHAR(20) DEFAULT 'A+',
    cgpa VARCHAR(20) DEFAULT '5.00',
    photo VARCHAR(255) DEFAULT 'assets/img/teacher-sagor.jpg',
    password_hash VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "students" VALUES(1,'000001','01','Jainal Abedin (Sagor)','Faridul Alam','Husneara','Fhakira khata, Boro Moheshkhali, Moheshkhali, Cox''s Bazar','Boro Moheshkhali, Moheshkhali, Cox''s Bazar','01879653143','gsctcbmcmrjas@gmail.com','2000-02-06','Muslim','Un-Married','5.10"','55 KG','O+','Honours 2nd Year (Political Science)','Cox''s Bazar Govt. College','I have good experience in MS Office, Graphic Design, Web Design, Logo Design, Web Browsing, Email, and Freelancing.',2,'Advance Microsoft Office',2020,'January to March','Old Batch','8:00 AM - 9:30 AM','A+','5.00','assets/img/teacher-sagor.jpg','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Completed','2026-11-11 16:39:43');
INSERT INTO "students" VALUES(2,'000002','02','Md. Rakibul Hasan','Md. Abdul Karim','Rokeya Begum','Poduar Bazar, Bishwo Road, Cumilla','Sadar Dakshin, Cumilla','01712345678','rakib.cumilla@gmail.com','2002-05-14','Muslim','Un-Married','5.7"','60 KG','B+','HSC Passed','Cumilla Victoria Govt. College','Skilled in MS Word, MS Excel, PowerPoint, and Bangla/English Typing.',2,'Advance Microsoft Office',2026,'January to March','New Batch','8:00 AM - 9:30 AM','A+','5.00','assets/img/logo.png','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Active','2026-11-11 16:39:43');
INSERT INTO "students" VALUES(3,'000003','03','Nusrat Jahan Mim','Md. Shafiqul Islam','Nasreen Akter','Shaktola, Cumilla Sadar','Laksham, Cumilla','01819223344','nusrat.mim@gmail.com','2003-11-20','Muslim','Un-Married','5.3"','50 KG','A+','B.A (Honours)','Cumilla Govt. Women''s College','Adobe Illustrator, Photoshop, Logo & Brand Design.',3,'Graphic Design',2026,'January to March','New Batch','11:00 AM - 12:30 PM','A+','5.00','assets/img/logo.png','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Active','2026-11-11 16:39:43');
INSERT INTO "students" VALUES(4,'000004','04','Tanvir Ahmed Chowdhury','Mahbubul Alam','Salma Khatun','Jangalia, Poduar Bazar, Cumilla','Chauddagram, Cumilla','01911887766','tanvir.web@gmail.com','2001-08-09','Muslim','Un-Married','5.8"','64 KG','O+','B.Sc in CSE (Running)','CCN University of Science & Technology','HTML5, CSS3, JavaScript, Bootstrap, PHP & MySQL.',4,'Web Design & Development',2026,'January to March','New Batch','12:30 PM - 2:00 PM','A','4.75','assets/img/logo.png','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Active','2026-11-11 16:39:43');
INSERT INTO "students" VALUES(5,'000005','05','Mehedi Hasan Shuvo','Md. Rafiqul Islam','Amena Begum','Tomsom Bridge, Cumilla','Barura, Cumilla','01615443322','mehedi.shuvo@gmail.com','2004-01-25','Muslim','Un-Married','5.6"','58 KG','AB+','SSC Passed','Cumilla Zilla School','Computer Fundamentals, MS Word, Excel, Internet & Email.',1,'Microsoft Office',2026,'January to March','New Batch','9:30 AM - 11:00 AM','A+','5.00','assets/img/logo.png','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Active','2026-11-11 16:39:43');
INSERT INTO "students" VALUES(6,'000006','06','Farhana Yeasmin','Anwar Hossain','Rehana Parvin','Kotbari Road, Cumilla','Burichang, Cumilla','01755667788','farhana.english@gmail.com','2002-03-18','Muslim','Un-Married','5.4"','52 KG','B+','BBS (Honours)','National University','Spoken English, Business Communication & Presentation.',5,'Spoken English',2020,'July to September','Old Batch','4:00 PM - 5:30 PM','A+','5.00','assets/img/logo.png','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Completed','2026-11-11 16:39:43');
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    designation VARCHAR(120) NOT NULL,
    role_type VARCHAR(50) DEFAULT 'teacher',
    qualification VARCHAR(200),
    phone VARCHAR(100),
    email VARCHAR(120),
    address TEXT,
    bio TEXT,
    photo VARCHAR(255) DEFAULT 'assets/img/teacher-lokman.jpg',
    facebook VARCHAR(255),
    youtube VARCHAR(255),
    twitter VARCHAR(255),
    instagram VARCHAR(255),
    github VARCHAR(255),
    linkedin VARCHAR(255),
    website VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Active',
    sort_order INTEGER DEFAULT 1
);
INSERT INTO "teachers" VALUES(1,'DR. A.K.M Lokman','Senior Teacher and Administrator','director','Chief Trainer & Director, Dream Career IT','01771770044','dc13edubd@gmail.com','Main Town, Sylhet / Poduar Bazar, Cumilla, Bangladesh.','Senior Teacher and Chief Administrator of Dream Career IT. Dedicated to building a skilled Digital Bangladesh through accessible, high-quality computer & IT education.','assets/img/teacher-lokman.jpg','https://www.facebook.com/profile.php?id=100000567091781','','','','','','','Active',1);
INSERT INTO "teachers" VALUES(2,'Jainal Abedin (Sagor)','Junior Teacher & Web Designer','designer','B.S.S (Honours) in Political Science | Web Designer & Full-Stack Developer','01879653143, 01875122169','gsctcbmcmrjas@gmail.com','Boro Moheshkhali, Moheshkhali, Cox''s Bazar, Bangladesh.','Hi, I''m a Professional Web Designer and WordPress Theme Developer. Experienced in HTML5, CSS3, JavaScript, jQuery, Bootstrap, PHP, and MySQL, as well as MS Office and Graphic Design training at Dream Career IT.','assets/img/teacher-sagor.jpg','https://www.facebook.com/jainalabedin.sagor.143','https://www.youtube.com/channel/UCbYQ17l6_mf6ilwlJGvsFSg','https://twitter.com/SagorJainal','https://www.instagram.com/jasagor2020/','https://github.com/jasagor2020','https://www.linkedin.com/in/jainal-abedin-sagor-448b121a9/','https://dcitbd.github.io','Active',2);
