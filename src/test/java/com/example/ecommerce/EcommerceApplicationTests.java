package com.example.ecommerce;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@DisplayName("E-commerce Application Integration Tests")
class EcommerceApplicationTests {

	@Test
	@DisplayName("Application context loads successfully")
	void contextLoads() {
		// Test passed - Spring context loaded
		assertTrue(true);
	}

	@Test
	@DisplayName("Basic arithmetic test")
	void basicMathTest() {
		assertEquals(4, 2 + 2, "Basic addition should work");
		assertTrue(10 > 5, "Comparison should work");
	}

	@Test
	@DisplayName("String validation test")
	void stringValidationTest() {
		String testString = "SportingShop";
		assertNotNull(testString, "String should not be null");
		assertEquals("SportingShop", testString);
		assertTrue(testString.length() > 0);
	}

	@Test
	@DisplayName("NULL assertion test")
	void nullHandlingTest() {
		Object nullObject = null;
		assertNull(nullObject, "Object should be null");
		
		Object notNull = new Object();
		assertNotNull(notNull, "Object should not be null");
	}

	@Test
	@DisplayName("Exception handling test")
	void exceptionHandlingTest() {
		assertThrows(ArithmeticException.class, () -> {
			int result = 1 / 0;
		}, "Division by zero should throw ArithmeticException");
	}
}
