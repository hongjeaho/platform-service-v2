package com.platform.common.web.config.resolver;

import com.platform.common.core.authority.AuthUser;
import com.platform.common.core.dto.AbstractResponse;
import com.platform.common.web.annotation.Auditing;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.core.MethodParameter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.annotation.RequestParamMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor;

@Component
public class AuditingHandlerMethodArgumentResolver  implements HandlerMethodArgumentResolver {
    private final RequestResponseBodyMethodProcessor requestBodyProcessor;
    private final RequestParamMethodArgumentResolver requestParamResolver;

    public AuditingHandlerMethodArgumentResolver(final List<HttpMessageConverter<?>> converters) {
        requestBodyProcessor = new RequestResponseBodyMethodProcessor(converters);
        requestParamResolver = new RequestParamMethodArgumentResolver(true);
    }

    @Override
    public boolean supportsParameter(final MethodParameter parameter) {

        return (
                List.class.isAssignableFrom(parameter.getParameterType()) || AbstractResponse.class.isAssignableFrom(parameter.getParameterType())
        ) && parameter.hasParameterAnnotation(Auditing.class);
    }

    @Override
    public Object resolveArgument(final MethodParameter parameter,
                                  final ModelAndViewContainer mavContainer,
                                  final NativeWebRequest webRequest,
                                  final WebDataBinderFactory binderFactory) throws Exception {

        var resolved = requestBodyProcessor.resolveArgument(
                parameter, mavContainer, webRequest, binderFactory
        );

        resolved = resolved != null ? resolved
                : requestParamResolver.resolveArgument(parameter, mavContainer, webRequest, binderFactory);

        if (resolved != null) {
            final var auditingAnnotation = parameter.getParameter().getAnnotation(Auditing.class);
            return setAuditInfo(resolved, auditingAnnotation.isUpdateOnly());
        }

        return null;
    }

    private static Object setAuditInfo(final Object obj, final boolean isUpdateOnly)
            throws IllegalAccessException {
        if (List.class.isAssignableFrom(obj.getClass())) {
            setAbstractListDtoAuditInfo((List<?>) obj, isUpdateOnly);
        } else if (AbstractResponse.class.isAssignableFrom(obj.getClass())) {
            setAbstractDtoAuditInfo((AbstractResponse) obj, isUpdateOnly);
        }

        return obj;
    }

    private static void setAbstractListDtoAuditInfo(List<?> list, boolean isUpdateOnly)
            throws IllegalAccessException {
        for (Object e : list) {
            if (!AbstractResponse.class.isAssignableFrom(e.getClass())) {
                continue;
            }
            setAbstractDtoAuditInfo(((AbstractResponse) e), isUpdateOnly);
        }
    }

    private static void setAbstractDtoAuditInfo(final AbstractResponse dto,
                                                boolean isUpdateOnly) throws IllegalAccessException {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return;
        }
        var userAccount = (AuthUser) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        if (!isUpdateOnly) {
            dto.setCreatedBy(userAccount.getSeq());
            dto.setCreatedTime(LocalDateTime.now());
        }
        dto.setUpdatedBy(userAccount.getSeq());
        dto.setUpdatedTime(LocalDateTime.now());

        setAbstractDtoFieldAuditInfo(dto, isUpdateOnly);
    }

    private static void setAbstractDtoFieldAuditInfo(
            final AbstractResponse dto,
            boolean isUpdateOnly) throws IllegalAccessException {
        var fields = dto.getClass().getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            var data = field.get(dto);
            if (data != null) {
                setAuditInfo(data, isUpdateOnly);
            }
        }
    }
}
