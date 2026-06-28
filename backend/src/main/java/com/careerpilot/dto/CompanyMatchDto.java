package com.careerpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyMatchDto {

    private Long id;
    private String name;
    private String industry;
    private Integer matchPercent;
    private List<String> missingSkills;
}