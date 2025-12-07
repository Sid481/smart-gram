# ---- Build stage ----
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ---- Run stage ----
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# copy jar from previous stage (update name if different)
COPY --from=build /app/target/*.jar app.jar

# tell Render which port the app listens on
EXPOSE 8080

# Spring Boot will read $PORT if you configure it (next step)
ENV PORT=8080

ENTRYPOINT ["java","-jar","app.jar"]