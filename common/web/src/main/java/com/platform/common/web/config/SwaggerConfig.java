package com.platform.common.web.config;

import com.platform.common.core.auth.AuthUser;
import com.platform.common.core.auth.BasicAuthority;
import com.platform.common.core.util.JwtTokenUtil;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("local")
@Configuration
@RequiredArgsConstructor
public class SwaggerConfig {

    private final JwtTokenUtil jwtTokenUtil;

    @Bean
    OpenAPI openAPI() {
        return new OpenAPI()
            .components(new Components())
            .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
            .title("service-platform-web")
            .description("platform API")
            .version("1.0");
    }

    @Bean
    public String createSwaggerJwtToken() {
        AuthUser authUser = AuthUser.builder()
            .seq(1L)
            .userId("admin")
            .roles(Set.of(
                BasicAuthority.builder().role("ADMIN").build(),
                BasicAuthority.builder().role("DECISION").build(),
                BasicAuthority.builder().role("IMPLEMENTER").build()
            ))
            .build();
        return "Bearer " + jwtTokenUtil.makeAuthToken(authUser);
    }
}
