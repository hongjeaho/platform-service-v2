package com.platform.common.web.config.converter;

import com.platform.common.core.type.LocalDateFormat;
import java.time.LocalDate;
import org.springframework.core.convert.converter.Converter;


public class LocalDateConverter implements Converter<String, LocalDate> {

    @Override
    public LocalDate convert(final String value) {
        return LocalDate.parse(value, LocalDateFormat.DATE.getFormatter());
    }
}