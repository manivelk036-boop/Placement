package com.careerpilot.dto;

import com.careerpilot.entity.CareerGoal;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String department;
    private String college;
    private Integer year;
    private Double cgpa;
    private java.util.List<String> skills;
    private CareerGoal careerGoal;
}
