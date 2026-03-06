package com.platform.common.web.annotation;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum MaskingPattern {
    DEFAULT(""),
    NAME("(?<=.{2})."),
    EMAIL("(?<=.{3}).(?=.*@)"),
    PASSWORD("(?<=.{4})."),
    PHONE("(?<=.{7}).");

    private final String pattern;

    public String get() {
        return pattern;
    }
}
