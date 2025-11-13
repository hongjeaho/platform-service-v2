package com.platform.common.jooq;

import org.jooq.codegen.DefaultGeneratorStrategy;
import org.jooq.meta.Definition;

public class CustomGeneratorStrategy extends DefaultGeneratorStrategy {

	@Override
	public String getJavaClassName(Definition definition, Mode mode) {

		if(Mode.DEFAULT == mode) {
			return "J" + super.getJavaClassName(definition, mode);
		} else if(Mode.POJO == mode){
			return super.getJavaClassName(definition, mode) + "Entity";
		}

		return super.getJavaClassName(definition, mode);
	}
}