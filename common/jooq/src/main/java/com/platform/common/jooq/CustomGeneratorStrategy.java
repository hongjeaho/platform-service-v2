package com.platform.common.jooq;

import org.jooq.codegen.DefaultGeneratorStrategy;
import org.jooq.meta.Definition;

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