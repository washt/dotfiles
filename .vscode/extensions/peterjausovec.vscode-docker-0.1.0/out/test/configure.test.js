"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'assert' provides assertion methods from node
const assert = require("assert");
const assertEx = require("./assertEx");
const vscode = require("vscode");
const fse = require("fs-extra");
const path = require("path");
const extensionVariables_1 = require("../extensionVariables");
const configure_1 = require("../configureWorkspace/configure");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const async_1 = require("../helpers/async");
const global_test_1 = require("./global.test");
let testRootFolder = global_test_1.getTestRootFolder();
suite("configure (Add Docker files to Workspace)", function () {
    this.timeout(30 * 1000);
    const outputChannel = vscode.window.createOutputChannel('Docker extension tests');
    extensionVariables_1.ext.outputChannel = outputChannel;
    function testConfigureDocker(platform, ...inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            // Set up simulated user input
            inputs.unshift(platform);
            const ui = new vscode_azureextensionui_1.TestUserInput(inputs);
            extensionVariables_1.ext.ui = ui;
            yield configure_1.configure(testRootFolder);
            assert.equal(inputs.length, 0, 'Not all inputs were used.');
        });
    }
    function writeFile(subfolderName, fileName, text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fse.ensureDir(path.join(testRootFolder, subfolderName));
            yield fse.writeFile(path.join(testRootFolder, subfolderName, fileName), text);
        });
    }
    function fileContains(fileName, text) {
        let contents = fse.readFileSync(path.join(testRootFolder, fileName)).toString();
        return contents.indexOf(text) >= 0;
    }
    function assertFileContains(fileName, text) {
        assert(fileContains(fileName, text), `Expected to find '${text}' in file ${fileName}`);
    }
    function assertNotFileContains(fileName, text) {
        assert(!fileContains(fileName, text), `Unexpected found '${text}' in file ${fileName}`);
    }
    function getFilesInProject() {
        return __awaiter(this, void 0, void 0, function* () {
            let files = yield async_1.globAsync('**/*', {
                cwd: testRootFolder,
                dot: true,
                nodir: true
            });
            return files;
        });
    }
    function testInEmptyFolder(name, func) {
        test(name, () => __awaiter(this, void 0, void 0, function* () {
            // Delete everything in the root testing folder
            assert(path.basename(testRootFolder) === global_test_1.constants.testOutputName, "Trying to delete wrong folder");
            ;
            yield fse.emptyDir(testRootFolder);
            yield func();
        }));
    }
    // Node.js
    suite("Node.js", () => {
        testInEmptyFolder("No package.json", () => __awaiter(this, void 0, void 0, function* () {
            yield testConfigureDocker('Node.js', '1234');
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 1234');
            assertFileContains('Dockerfile', 'CMD npm start');
            assertFileContains('docker-compose.debug.yml', '1234:1234');
            assertFileContains('docker-compose.debug.yml', '9229:9229');
            assertFileContains('docker-compose.debug.yml', 'image: testoutput');
            assertFileContains('docker-compose.debug.yml', 'NODE_ENV: development');
            assertFileContains('docker-compose.debug.yml', 'command: node --inspect index.js');
            assertFileContains('docker-compose.yml', '1234:1234');
            assertNotFileContains('docker-compose.yml', '9229:9229');
            assertFileContains('docker-compose.yml', 'image: testoutput');
            assertFileContains('docker-compose.yml', 'NODE_ENV: production');
            assertNotFileContains('docker-compose.yml', 'command: node --inspect index.js');
            assertFileContains('.dockerignore', '.vscode');
        }));
        testInEmptyFolder("With start script", () => __awaiter(this, void 0, void 0, function* () {
            yield writeFile('', 'package.json', `{
                "name": "vscode-docker",
                "version": "0.0.28",
                "main": "./out/dockerExtension",
                "author": "Azure",
                "scripts": {
                    "vscode:prepublish": "tsc -p ./",
                    "start": "startMyUp.cmd",
                    "test": "npm run build && node ./node_modules/vscode/bin/test"
                },
                "dependencies": {
                    "azure-arm-containerregistry": "^1.0.0-preview"
                }
            }
                `);
            yield testConfigureDocker('Node.js', '4321');
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['package.json', 'Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 4321');
            assertFileContains('Dockerfile', 'CMD npm start');
            assertFileContains('docker-compose.debug.yml', '4321:4321');
            assertFileContains('docker-compose.debug.yml', '9229:9229');
            assertFileContains('docker-compose.debug.yml', 'image: testoutput');
            assertFileContains('docker-compose.debug.yml', 'NODE_ENV: development');
            assertFileContains('docker-compose.debug.yml', 'command: node --inspect index.js');
            assertFileContains('docker-compose.yml', '4321:4321');
            assertNotFileContains('docker-compose.yml', '9229:9229');
            assertFileContains('docker-compose.yml', 'image: testoutput');
            assertFileContains('docker-compose.yml', 'NODE_ENV: production');
            assertNotFileContains('docker-compose.yml', 'command: node --inspect index.js');
            assertFileContains('.dockerignore', '.vscode');
        }));
        testInEmptyFolder("Without start script", () => __awaiter(this, void 0, void 0, function* () {
            yield writeFile('', 'package.json', `{
                "name": "vscode-docker",
                "version": "0.0.28",
                "main": "./out/dockerExtension",
                "author": "Azure",
                "scripts": {
                    "vscode:prepublish": "tsc -p ./",
                    "test": "npm run build && node ./node_modules/vscode/bin/test"
                },
                "dependencies": {
                    "azure-arm-containerregistry": "^1.0.0-preview"
                }
            }
                `);
            yield testConfigureDocker('Node.js', '4321');
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['package.json', 'Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 4321');
            assertFileContains('Dockerfile', 'CMD node ./out/dockerExtension');
        }));
    });
    // .NET Core Console
    suite(".NET Core Console", () => {
        const projectFile = `
        <Project Sdk="Microsoft.NET.Sdk" ToolsVersion="15.0">

            <PropertyGroup>
            <OutputType>Exe</OutputType>
            <TargetFramework>netcoreapp2.1</TargetFramework>
            </PropertyGroup>

            <ItemGroup>
            <ProjectReference Include="..\\utils\\utils.csproj" />
            </ItemGroup>

        </Project>
        `;
        testInEmptyFolder("No project file", () => __awaiter(this, void 0, void 0, function* () {
            yield assertEx.throwsOrRejectsAsync(() => __awaiter(this, void 0, void 0, function* () { return testConfigureDocker('.NET Core Console', 'Windows', '1234'); }), { message: "No .csproj file could be found." });
        }));
        testInEmptyFolder("Multiple project files", () => __awaiter(this, void 0, void 0, function* () {
            yield writeFile('projectFolder1', 'aspnetapp.csproj', projectFile);
            yield writeFile('projectFolder2', 'aspnetapp.csproj', projectFile);
            yield testConfigureDocker('.NET Core Console', 'Windows', '1234', 'projectFolder2/aspnetapp.csproj');
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', '.dockerignore', 'projectFolder1/aspnetapp.csproj', 'projectFolder2/aspnetapp.csproj'], "The set of files in the project folder after configure was run is not correct.");
            assertNotFileContains('Dockerfile', 'projectFolder1/aspnetapp');
            assertFileContains('Dockerfile', 'projectFolder2/aspnetapp');
        }));
        testInEmptyFolder("Windows", () => __awaiter(this, void 0, void 0, function* () {
            yield writeFile('projectFolder', 'aspnetapp.csproj', projectFile);
            yield testConfigureDocker('.NET Core Console', 'Windows', '1234');
            let projectFiles = yield getFilesInProject();
            // No docker-compose files
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', '.dockerignore', 'projectFolder/aspnetapp.csproj'], "The set of files in the project folder after configure was run is not correct.");
            assertNotFileContains('Dockerfile', 'EXPOSE');
            assertFileContains('Dockerfile', 'RUN dotnet build projectFolder/aspnetapp.csproj -c Release -o /app');
            assertFileContains('Dockerfile', 'ENTRYPOINT ["dotnet", "projectFolder/aspnetapp.dll"]');
            assertFileContains('Dockerfile', 'FROM microsoft/dotnet:2.0-runtime-nanoserver-1709 AS base');
            assertFileContains('Dockerfile', 'FROM microsoft/dotnet:2.0-sdk-nanoserver-1709 AS build');
        }));
        testInEmptyFolder("Linux", () => __awaiter(this, void 0, void 0, function* () {
            // https://github.com/dotnet/dotnet-docker/tree/master/samples/aspnetapp
            yield writeFile('projectFolder2', 'aspnetapp2.csproj', projectFile);
            yield testConfigureDocker('.NET Core Console', 'Linux', '1234');
            let projectFiles = yield getFilesInProject();
            // No docker-compose files
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', '.dockerignore', 'projectFolder2/aspnetapp2.csproj'], "The set of files in the project folder after configure was run is not correct.");
            assertNotFileContains('Dockerfile', 'EXPOSE 1234');
            assertFileContains('Dockerfile', 'RUN dotnet build projectFolder2/aspnetapp2.csproj -c Release -o /app');
            assertFileContains('Dockerfile', 'ENTRYPOINT ["dotnet", "projectFolder2/aspnetapp2.dll"]');
            assertFileContains('Dockerfile', 'FROM microsoft/dotnet:2.0-runtime AS base');
            assertFileContains('Dockerfile', 'FROM microsoft/dotnet:2.0-sdk AS build');
        }));
    });
    // ASP.NET Core
    suite("ASP.NET Core", () => {
        const projectFile = `
        <Project Sdk="Microsoft.NET.Sdk.Web">

        <PropertyGroup>
            <TargetFramework>netcoreapp2.1</TargetFramework>
        </PropertyGroup>

        <ItemGroup>
            <PackageReference Include="Microsoft.AspNetCore.App" />
        </ItemGroup>

        </Project>
        `;
        testInEmptyFolder("ASP.NET Core no project file", () => __awaiter(this, void 0, void 0, function* () {
            yield assertEx.throwsOrRejectsAsync(() => __awaiter(this, void 0, void 0, function* () { return testConfigureDocker('ASP.NET Core', 'Windows', '1234'); }), { message: "No .csproj file could be found." });
        }));
        testInEmptyFolder("Windows", () => __awaiter(this, void 0, void 0, function* () {
            // https://github.com/dotnet/dotnet-docker/tree/master/samples/aspnetapp
            yield writeFile('projectFolder', 'aspnetapp.csproj', projectFile);
            yield testConfigureDocker('ASP.NET Core', 'Windows', undefined /*use default port*/);
            let projectFiles = yield getFilesInProject();
            // No docker-compose files
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', '.dockerignore', 'projectFolder/aspnetapp.csproj'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 80');
            assertFileContains('Dockerfile', 'RUN dotnet build projectFolder/aspnetapp.csproj -c Release -o /app');
            assertFileContains('Dockerfile', 'ENTRYPOINT ["dotnet", "projectFolder/aspnetapp.dll"]');
            assertFileContains('Dockerfile', 'FROM microsoft/aspnetcore-build:2.0-nanoserver-1709 AS build');
        }));
        testInEmptyFolder("Linux", () => __awaiter(this, void 0, void 0, function* () {
            // https://github.com/dotnet/dotnet-docker/tree/master/samples/aspnetapp
            yield writeFile('projectFolder2', 'aspnetapp2.csproj', projectFile);
            yield testConfigureDocker('ASP.NET Core', 'Linux', '1234');
            let projectFiles = yield getFilesInProject();
            // No docker-compose files
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', '.dockerignore', 'projectFolder2/aspnetapp2.csproj'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 1234');
            assertFileContains('Dockerfile', 'RUN dotnet build projectFolder2/aspnetapp2.csproj -c Release -o /app');
            assertFileContains('Dockerfile', 'ENTRYPOINT ["dotnet", "projectFolder2/aspnetapp2.dll"]');
            assertFileContains('Dockerfile', 'FROM microsoft/aspnetcore-build:2.0 AS build');
        }));
    });
    // Java
    suite("Java", () => {
        testInEmptyFolder("No pom file", () => __awaiter(this, void 0, void 0, function* () {
            yield testConfigureDocker('Java', '1234');
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 1234');
            assertFileContains('Dockerfile', 'ARG JAVA_OPTS');
            assertFileContains('Dockerfile', 'ADD testoutput.jar testoutput.jar');
            assertFileContains('Dockerfile', 'ENTRYPOINT exec java $JAVA_OPTS -jar testoutput.jar');
        }));
        testInEmptyFolder("Empty pom file", () => __awaiter(this, void 0, void 0, function* () {
            yield writeFile('', 'pom.xml', `
                <?xml version = "1.0" encoding = "UTF-8"?>
                `);
            yield testConfigureDocker('Java', undefined /*port*/);
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['pom.xml', 'Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 3000');
            assertFileContains('Dockerfile', 'ARG JAVA_OPTS');
            assertFileContains('Dockerfile', 'ADD testoutput.jar testoutput.jar');
            assertFileContains('Dockerfile', 'ENTRYPOINT exec java $JAVA_OPTS -jar testoutput.jar');
        }));
        testInEmptyFolder("Pom file", () => __awaiter(this, void 0, void 0, function* () {
            yield writeFile('', 'pom.xml', `
                <?xml version = "1.0" encoding = "UTF-8"?>
                    <project xmlns="http://maven.apache.org/POM/4.0.0"
                        xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance"
                        xsi:schemaLocation = "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
                    <modelVersion>4.0.0</modelVersion>

                    <groupId>com.microsoft.azure</groupId>
                    <artifactId>app-artifact-id</artifactId>
                    <version>1.0-SNAPSHOT</version>
                    <packaging>jar</packaging>

                    <name>app-on-azure</name>
                    <description>Test</description>
                    </project>
                `);
            yield testConfigureDocker('Java', undefined /*port*/);
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['pom.xml', 'Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 3000');
            assertFileContains('Dockerfile', 'ARG JAVA_OPTS');
            assertFileContains('Dockerfile', 'ADD target/app-artifact-id-1.0-SNAPSHOT.jar testoutput.jar');
            assertFileContains('Dockerfile', 'ENTRYPOINT exec java $JAVA_OPTS -jar testoutput.jar');
        }));
        testInEmptyFolder("Empty gradle file - defaults", () => __awaiter(this, void 0, void 0, function* () {
            // https://github.com/dotnet/dotnet-docker/tree/master/samples/aspnetapp
            yield writeFile('', 'build.gradle', ``);
            yield testConfigureDocker('Java', undefined /*port*/);
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['build.gradle', 'Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 3000');
            assertFileContains('Dockerfile', 'ARG JAVA_OPTS');
            assertFileContains('Dockerfile', 'ADD build/libs/testOutput-0.0.1.jar testoutput.jar');
            assertFileContains('Dockerfile', 'ENTRYPOINT exec java $JAVA_OPTS -jar testoutput.jar');
        }));
        testInEmptyFolder("Gradle with jar", () => __awaiter(this, void 0, void 0, function* () {
            // https://github.com/dotnet/dotnet-docker/tree/master/samples/aspnetapp
            yield writeFile('', 'build.gradle', `
                apply plugin: 'groovy'

                dependencies {
                    compile gradleApi()
                    compile localGroovy()
                }

                apply plugin: 'maven'
                apply plugin: 'signing'

                repositories {
                    mavenCentral()
                }

                group = 'com.github.test'
                version = '1.2.3'
                sourceCompatibility = 1.7
                targetCompatibility = 1.7

                task javadocJar(type: Jar) {
                    classifier = 'javadoc'
                    from javadoc
                }

                task sourcesJar(type: Jar) {
                    classifier = 'sources'
                    from sourceSets.main.allSource
                }

                artifacts {
                    archives javadocJar, sourcesJar
                }

                jar {
                    configurations.shade.each { dep ->
                        from(project.zipTree(dep)){
                            duplicatesStrategy 'warn'
                        }
                    }

                    manifest {
                        attributes 'version':project.version
                        attributes 'javaCompliance': project.targetCompatibility
                        attributes 'group':project.group
                        attributes 'Implementation-Version': project.version + getGitHash()
                    }
                    archiveName 'abc.jar'
                }

                uploadArchives {
                    repositories {
                        mavenDeployer {

                            beforeDeployment { MavenDeployment deployment -> signing.signPom(deployment) }

                            repository(url: uri('../repo'))

                            pom.project {
                                name 'test'
                                packaging 'jar'
                                description 'test'
                                url 'https://github.com/test'
                            }
                        }
                    }
                }
                            `);
            yield testConfigureDocker('Java', undefined /*port*/);
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['build.gradle', 'Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'EXPOSE 3000');
            assertFileContains('Dockerfile', 'ARG JAVA_OPTS');
            assertFileContains('Dockerfile', 'ADD build/libs/testOutput-1.2.3.jar testoutput.jar');
            assertFileContains('Dockerfile', 'ENTRYPOINT exec java $JAVA_OPTS -jar testoutput.jar');
        }));
    });
    // Python
    suite("Python", () => {
        testInEmptyFolder("Python", () => __awaiter(this, void 0, void 0, function* () {
            yield testConfigureDocker('Python', undefined /*port*/);
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'FROM python:alpine');
            assertFileContains('Dockerfile', 'LABEL Name=testoutput Version=0.0.1');
            assertFileContains('Dockerfile', 'EXPOSE 3000');
            assertFileContains('Dockerfile', 'CMD ["python3", "-m", "testoutput"]');
        }));
    });
    // Ruby
    suite("Ruby", () => {
        testInEmptyFolder("Ruby", () => __awaiter(this, void 0, void 0, function* () {
            yield testConfigureDocker('Ruby', undefined /*port*/);
            let projectFiles = yield getFilesInProject();
            assertEx.unorderedArraysEqual(projectFiles, ['Dockerfile', 'docker-compose.debug.yml', 'docker-compose.yml', '.dockerignore'], "The set of files in the project folder after configure was run is not correct.");
            assertFileContains('Dockerfile', 'FROM ruby:2.5-slim');
            assertFileContains('Dockerfile', 'LABEL Name=testoutput Version=0.0.1');
            assertFileContains('Dockerfile', 'COPY Gemfile Gemfile.lock ./');
            assertFileContains('Dockerfile', 'RUN bundle install');
            assertFileContains('Dockerfile', 'CMD ["ruby", "testoutput.rb"]');
        }));
    });
    //
});
//# sourceMappingURL=configure.test.js.map