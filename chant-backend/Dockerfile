FROM eclipse-temurin:8-jdk
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/chant-0.0.1-SNAPSHOT.war"]