package com.careerpilot.controller;

import com.careerpilot.dto.ApiResponse;
import com.careerpilot.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/salary-predictor")
@RequiredArgsConstructor
public class SalaryController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> predictSalary(
            @AuthenticationPrincipal Student student) {

        String goal = student.getCareerGoal() != null
                ? student.getCareerGoal().name().replace("_", " ")
                : "Software Developer";

        double baseMultiplier = 1.0;
        if (student.getCgpa() != null && student.getCgpa() >= 8.0) baseMultiplier += 0.15;
        if (student.getSkills() != null && student.getSkills().size() >= 5) baseMultiplier += 0.10;
        int xpBonus = Math.min(30, student.getXp() / 100);

        int baseSalary = 350000; // ₹3.5L base
        int currentSalary = (int) (baseSalary * baseMultiplier) + (xpBonus * 1000);
        int futureSalary = (int) (currentSalary * 1.4);
        int dreamSalary = (int) (currentSalary * 2.0);

        Map<String, Object> topCompanySalaries = new LinkedHashMap<>();
        topCompanySalaries.put("Product Companies", "₹8L – ₹25L");
        topCompanySalaries.put("Service Companies", "₹3.5L – ₹8L");
        topCompanySalaries.put("Startups", "₹5L – ₹15L");
        topCompanySalaries.put("MNCs", "₹6L – ₹20L");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("careerGoal", goal);
        result.put("currentEstimate", String.format("₹%.1fL", currentSalary / 100000.0));
        result.put("after2Years", String.format("₹%.1fL", futureSalary / 100000.0));
        result.put("dreamSalary", String.format("₹%.1fL", dreamSalary / 100000.0));
        result.put("byCompanyType", topCompanySalaries);
        result.put("tips", new String[]{
                "Complete all roadmap topics to boost salary by 20%",
                "Add internship experience (+15-25%)",
                "Earn relevant certifications (+10%)",
                "Build strong GitHub portfolio (+5-10%)"
        });

        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
