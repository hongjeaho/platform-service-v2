package com.platform.common.jooq;

import org.jooq.codegen.DefaultGeneratorStrategy;
import org.jooq.meta.Definition;

/**
 * jOOQ의 DefaultGeneratorStrategy를 확장하여 사용자 정의 클래스 이름 생성 전략을 정의하는 클래스.
 *
 * 이 클래스는 엔티티, DAO, 인터페이스 등 다양한 생성 모드에 따라 클래스 이름을 커스터마이징합니다.
 * 이를 통해 개발자는 보다 의미 있는 클래스 이름으로 코드를 생성할 수 있습니다.
 *
 * @see DefaultGeneratorStrategy
 */
public class CustomGeneratorStrategy extends DefaultGeneratorStrategy {

	@Override
	public String getJavaClassName(Definition definition, Mode mode) {
		String baseName = super.getJavaClassName(definition, mode);

		return switch (mode) {
			case DEFAULT -> "J" + baseName;
			case POJO -> baseName + "Entity";
			case RECORD -> baseName + "Record";
			case INTERFACE -> "I" + baseName;
			case DAO -> baseName + "Dao";
			default -> baseName;
		};
	}
}