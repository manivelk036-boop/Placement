package com.careerpilot.entity;

public enum StudentLevel {
    CAREER_EXPLORER(1, 0),
    LEARNER(2, 500),
    DEVELOPER(3, 1500),
    PROBLEM_SOLVER(4, 3500),
    PLACEMENT_READY(5, 6000),
    INTERVIEW_MASTER(6, 10000),
    CAREER_CHAMPION(7, 15000);

    private final int level;
    private final int xpRequired;

    StudentLevel(int level, int xpRequired) {
        this.level = level;
        this.xpRequired = xpRequired;
    }

    public int getLevel() {
        return level;
    }

    public int getXpRequired() {
        return xpRequired;
    }

    public static StudentLevel fromXp(int xp) {
        StudentLevel current = CAREER_EXPLORER;
        for (StudentLevel level : values()) {
            if (xp >= level.xpRequired) {
                current = level;
            }
        }
        return current;
    }
}
