package com.careerpilot.config;

import com.careerpilot.entity.Company;
import com.careerpilot.entity.Student;
import com.careerpilot.repository.CompanyRepository;
import com.careerpilot.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final CompanyRepository companyRepository;
        private final StudentRepository studentRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                try {
                        Student admin = studentRepository.findByEmail("admin@careerpilot.com").orElse(null);
                        if (admin == null) {
                                studentRepository.save(Student.builder()
                                        .name("CareerPilot Admin")
                                        .email("admin@careerpilot.com")
                                        .password(passwordEncoder.encode("adminpassword"))
                                        .role("ROLE_ADMIN")
                                        .build());
                        } else {
                                boolean updated = false;
                                if (!"ROLE_ADMIN".equals(admin.getRole())) {
                                        admin.setRole("ROLE_ADMIN");
                                        updated = true;
                                }
                                if (!passwordEncoder.matches("adminpassword", admin.getPassword())) {
                                        admin.setPassword(passwordEncoder.encode("adminpassword"));
                                        updated = true;
                                }
                                if (updated) {
                                        studentRepository.save(admin);
                                }
                        }
                } catch (Exception e) {
                        System.out.println("Skipping admin check: " + e.getMessage());
                }

                try {
                        if (companyRepository.count() > 0) {
                                return;
                        }
                } catch (Exception e) {
                        System.out.println("Skipping Company seeding: " + e.getMessage());
                        return;
                }

                List<Company> companies = List.of(

                                Company.builder()
                                                .name("TCS")
                                                .industry("IT Services")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "SQL",
                                                                "OOP",
                                                                "Problem Solving"))
                                                .minCgpa(6.5)
                                                .description("Tata Consultancy Services")
                                                .build(),

                                Company.builder()
                                                .name("Infosys")
                                                .industry("IT Services")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "Python",
                                                                "SQL",
                                                                "Communication"))
                                                .minCgpa(6.0)
                                                .description("Infosys Limited")
                                                .build(),

                                Company.builder()
                                                .name("Wipro")
                                                .industry("IT Services")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "SQL",
                                                                "Aptitude"))
                                                .minCgpa(6.0)
                                                .description("Wipro Technologies")
                                                .build(),

                                Company.builder()
                                                .name("Zoho")
                                                .industry("Product")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "JavaScript",
                                                                "DSA",
                                                                "System Design"))
                                                .minCgpa(7.0)
                                                .description("Zoho Corporation")
                                                .build(),

                                Company.builder()
                                                .name("Freshworks")
                                                .industry("SaaS")
                                                .requiredSkills(List.of(
                                                                "JavaScript",
                                                                "React",
                                                                "Node.js",
                                                                "SQL"))
                                                .minCgpa(7.0)
                                                .description("Freshworks Inc.")
                                                .build(),

                                Company.builder()
                                                .name("Accenture")
                                                .industry("IT Consulting")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "SQL",
                                                                "Communication",
                                                                "Aptitude"))
                                                .minCgpa(6.5)
                                                .description("Accenture Solutions")
                                                .build(),

                                Company.builder()
                                                .name("Cognizant")
                                                .industry("IT Services")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "Python",
                                                                "SQL",
                                                                "OOP"))
                                                .minCgpa(6.0)
                                                .description("Cognizant Technology Solutions")
                                                .build(),

                                Company.builder()
                                                .name("Capgemini")
                                                .industry("IT Consulting")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "SQL",
                                                                "Aptitude",
                                                                "Communication"))
                                                .minCgpa(6.0)
                                                .description("Capgemini India")
                                                .build(),

                                Company.builder()
                                                .name("HCLTech")
                                                .industry("IT Services")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "Spring Boot",
                                                                "SQL",
                                                                "Git"))
                                                .minCgpa(6.5)
                                                .description("HCL Technologies")
                                                .build(),

                                Company.builder()
                                                .name("Amazon")
                                                .industry("Product")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "DSA",
                                                                "System Design",
                                                                "AWS"))
                                                .minCgpa(7.5)
                                                .description("Amazon Development Centre")
                                                .build(),

                                Company.builder()
                                                .name("Google")
                                                .industry("Product")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "C++",
                                                                "DSA",
                                                                "Algorithms"))
                                                .minCgpa(8.0)
                                                .description("Google India")
                                                .build(),

                                Company.builder()
                                                .name("Microsoft")
                                                .industry("Product")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "C#",
                                                                "DSA",
                                                                "Azure"))
                                                .minCgpa(7.5)
                                                .description("Microsoft India")
                                                .build(),

                                Company.builder()
                                                .name("IBM")
                                                .industry("IT Services")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "Cloud",
                                                                "SQL",
                                                                "Linux"))
                                                .minCgpa(6.5)
                                                .description("IBM India")
                                                .build(),

                                Company.builder()
                                                .name("Oracle")
                                                .industry("Database")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "SQL",
                                                                "Spring Boot",
                                                                "Database"))
                                                .minCgpa(7.0)
                                                .description("Oracle India")
                                                .build(),

                                Company.builder()
                                                .name("Tech Mahindra")
                                                .industry("IT Services")
                                                .requiredSkills(List.of(
                                                                "Java",
                                                                "SQL",
                                                                "Communication",
                                                                "Git"))
                                                .minCgpa(6.0)
                                                .description("Tech Mahindra")
                                                .build()

                );

                companyRepository.saveAll(companies);

                System.out.println("✔ Successfully seeded " + companies.size() + " companies.");
        }
}