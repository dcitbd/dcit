package bd.edu.amadergram;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * AMADER GRAM IT CENTER - Java Certificate & Student Verification Module
 * Can be run via CLI or integrated with Java Servlet / Spring / Desktop tools:
 * javac AmaderGramCertificateVerifier.java
 * java -cp .:sqlite-jdbc.jar bd.edu.amadergram.AmaderGramCertificateVerifier 000001
 */
public class AmaderGramCertificateVerifier {
    private static final String DB_URL = "jdbc:sqlite:../data/amader_gram.sqlite";

    public static void main(String[] args) {
        String regOrCert = args.length > 0 ? args[0] : "000001";
        System.out.println("====================================================");
        System.out.println("   AMADER GRAM IT CENTER - JAVA VERIFICATION CLI    ");
        System.out.println("====================================================");
        verifyCertificate(regOrCert);
    }

    public static void verifyCertificate(String queryKey) {
        String sql = "SELECT cert_no, reg_no, student_name, course_name, batch_year, session_quarter, grade, issue_date, verification_code, status "
                   + "FROM certificates WHERE reg_no = ? OR cert_no = ? OR verification_code = ?";
        try (Connection conn = DriverManager.getConnection(DB_URL);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, queryKey);
            pstmt.setString(2, queryKey);
            pstmt.setString(3, queryKey);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    System.out.println("STATUS            : VERIFIED (" + rs.getString("status") + ")");
                    System.out.println("Certificate No    : " + rs.getString("cert_no"));
                    System.out.println("Registration No   : " + rs.getString("reg_no"));
                    System.out.println("Student Name      : " + rs.getString("student_name"));
                    System.out.println("Course Name       : " + rs.getString("course_name"));
                    System.out.println("Session & Batch   : " + rs.getString("session_quarter") + " (" + rs.getInt("batch_year") + ")");
                    System.out.println("Result / Grade    : " + rs.getString("grade"));
                    System.out.println("Issue Date        : " + rs.getString("issue_date"));
                    System.out.println("Verification Code : " + rs.getString("verification_code"));
                } else {
                    System.out.println("No certificate record found for: " + queryKey);
                }
            }
        } catch (Exception e) {
            System.out.println("Database check info: " + e.getMessage());
        }
    }
}
