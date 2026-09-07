package com.careerpilot.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "YouTube URL is required")
    private String youtubeUrl;

    private Integer durationMinutes;

    private Integer orderNo;
}
