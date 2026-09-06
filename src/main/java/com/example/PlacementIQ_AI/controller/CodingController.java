package com.example.PlacementIQ_AI.controller;

import com.example.PlacementIQ_AI.entity.CodingResult;
import com.example.PlacementIQ_AI.repository.CodingResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/coding")
@CrossOrigin(origins = "http://localhost:5173")
public class CodingController {

    private final CodingResultRepository codingResultRepository;

    public CodingController(
            CodingResultRepository codingResultRepository) {

        this.codingResultRepository =
                codingResultRepository;
    }

    // =========================================================
    // SUBMIT CODING RESULT
    // =========================================================

    @PostMapping("/submit")
    public ResponseEntity<CodingResult> submitResult(
            @RequestBody CodingResult result) {

        CodingResult savedResult =
                codingResultRepository.save(result);

        return ResponseEntity.ok(savedResult);
    }

    // =========================================================
    // GET LATEST CODING RESULT
    // =========================================================

    @GetMapping("/result/{userId}")
    public ResponseEntity<CodingResult> getLatestResult(
            @PathVariable Long userId) {

        return codingResultRepository
                .findTopByUserIdOrderByIdDesc(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // RUN CODE
    // =========================================================

    @PostMapping("/run")
    public ResponseEntity<CodingRunResponse> runCode(
            @RequestBody CodingRunRequest request) {

        Path directory = null;

        try {

            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (request == null) {

                return ResponseEntity.badRequest()
                        .body(
                                CodingRunResponse.error(
                                        "Request cannot be empty."
                                )
                        );
            }

            if (request.questionId == null) {

                return ResponseEntity.badRequest()
                        .body(
                                CodingRunResponse.error(
                                        "Question ID is required."
                                )
                        );
            }

            if (request.code == null ||
                    request.code.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(
                                CodingRunResponse.error(
                                        "Code cannot be empty."
                                )
                        );
            }

            String language =
                    request.language == null
                            ? "java"
                            : request.language.toLowerCase();

            // -------------------------------------------------
            // CREATE TEMP DIRECTORY
            // -------------------------------------------------

            directory =
                    Files.createTempDirectory(
                            "placementiq-coding-"
                    );

            // -------------------------------------------------
            // RUN ALL TEST CASES
            // -------------------------------------------------

            List<TestCaseResult> testResults =
                    new ArrayList<>();

            int totalTestCases =
                    getTotalTestCases(
                            request.questionId
                    );

            for (int testCaseNumber = 1;
                 testCaseNumber <= totalTestCases;
                 testCaseNumber++) {

                TestCaseDefinition testCase =
                        getTestCase(
                                request.questionId,
                                testCaseNumber
                        );

                try {

                    String actualOutput;

                    switch (language) {

                        case "java":

                            actualOutput =
                                    executeJava(
                                            directory,
                                            request.questionId,
                                            request.code,
                                            testCaseNumber
                                    );

                            break;

                        case "python":

                            actualOutput =
                                    executePython(
                                            directory,
                                            request.questionId,
                                            request.code,
                                            testCaseNumber
                                    );

                            break;

                        case "javascript":
                        case "js":

                            actualOutput =
                                    executeJavaScript(
                                            directory,
                                            request.questionId,
                                            request.code,
                                            testCaseNumber
                                    );

                            break;

                        default:

                            return ResponseEntity.badRequest()
                                    .body(
                                            CodingRunResponse.error(
                                                    "Unsupported language: "
                                                            + request.language
                                            )
                                    );
                    }

                    actualOutput =
                            normalizeOutput(
                                    actualOutput
                            );

                    String expectedOutput =
                            normalizeOutput(
                                    testCase.output
                            );

                    boolean passed =
                            outputsMatch(
                                    actualOutput,
                                    expectedOutput
                            );

                    testResults.add(
                            new TestCaseResult(
                                    testCaseNumber,
                                    passed,
                                    testCase.input,
                                    testCase.output,
                                    actualOutput
                            )
                    );

                } catch (Exception testError) {

                    testResults.add(
                            new TestCaseResult(
                                    testCaseNumber,
                                    false,
                                    testCase.input,
                                    testCase.output,
                                    testError.getMessage() == null
                                            ? "Execution failed."
                                            : testError.getMessage()
                            )
                    );
                }
            }

            // -------------------------------------------------
            // CHECK ALL PASSED
            // -------------------------------------------------

            boolean allPassed =
                    !testResults.isEmpty() &&
                            testResults.stream()
                                    .allMatch(
                                            TestCaseResult::isPassed
                                    );

            int passedCount =
                    (int) testResults.stream()
                            .filter(
                                    TestCaseResult::isPassed
                            )
                            .count();

            String message;

            if (allPassed) {

                message =
                        "All test cases passed.";

            } else {

                message =
                        passedCount
                                + " / "
                                + testResults.size()
                                + " test cases passed.";
            }

            CodingRunResponse response =
                    new CodingRunResponse(
                            true,
                            allPassed,
                            message,
                            testResults
                    );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.ok(
                    CodingRunResponse.error(
                            e.getMessage() == null
                                    ? "Code execution failed."
                                    : e.getMessage()
                    )
            );

        } finally {

            // -------------------------------------------------
            // DELETE TEMP FILES
            // -------------------------------------------------

            deleteDirectory(directory);
        }
    }

    // =========================================================
    // TOTAL TEST CASES
    // =========================================================

    private int getTotalTestCases(
            Long questionId
    ) {

        if (questionId == 1 ||
                questionId == 2) {

            return 2;
        }

        throw new RuntimeException(
                "Invalid question ID: " + questionId
        );
    }

    // =========================================================
    // TEST CASE DEFINITIONS
    // =========================================================

    private TestCaseDefinition getTestCase(
            Long questionId,
            int testCaseNumber
    ) {

        // -----------------------------------------------------
        // QUESTION 1 - TWO SUM
        // -----------------------------------------------------

        if (questionId == 1) {

            if (testCaseNumber == 1) {

                return new TestCaseDefinition(
                        "nums = [2, 7, 11, 15], target = 9",
                        "[0, 1]"
                );
            }

            if (testCaseNumber == 2) {

                return new TestCaseDefinition(
                        "nums = [3, 2, 4], target = 6",
                        "[1, 2]"
                );
            }
        }

        // -----------------------------------------------------
        // QUESTION 2 - VALID PARENTHESES
        // -----------------------------------------------------

        if (questionId == 2) {

            if (testCaseNumber == 1) {

                return new TestCaseDefinition(
                        "s = \"()[]{}\"",
                        "true"
                );
            }

            if (testCaseNumber == 2) {

                return new TestCaseDefinition(
                        "s = \"(]\"",
                        "false"
                );
            }
        }

        throw new RuntimeException(
                "Invalid test case."
        );
    }

    // =========================================================
    // JAVA EXECUTION
    // =========================================================

    private String executeJava(
            Path directory,
            Long questionId,
            String code,
            int testCaseNumber
    ) throws Exception {

        Path solutionFile =
                directory.resolve("Solution.java");

        Path runnerFile =
                directory.resolve("Runner.java");

        // IMPORTANT:
        // User code is written directly.
        // We DO NOT create another Solution class.

        Files.writeString(
                solutionFile,
                code.trim()
        );

        String runnerCode =
                createJavaRunner(
                        questionId,
                        testCaseNumber
                );

        Files.writeString(
                runnerFile,
                runnerCode
        );

        // -----------------------------------------------------
        // COMPILE
        // -----------------------------------------------------

        Process compile =
                new ProcessBuilder(
                        "javac",
                        "Solution.java",
                        "Runner.java"
                )
                        .directory(
                                directory.toFile()
                        )
                        .redirectErrorStream(true)
                        .start();

        boolean compiled =
                compile.waitFor(
                        10,
                        TimeUnit.SECONDS
                );

        String compileOutput =
                readProcessOutput(compile);

        if (!compiled) {

            compile.destroyForcibly();

            throw new RuntimeException(
                    "Compilation timed out."
            );
        }

        if (compile.exitValue() != 0) {

            throw new RuntimeException(
                    compileOutput
            );
        }

        // -----------------------------------------------------
        // RUN
        // -----------------------------------------------------

        Process process =
                new ProcessBuilder(
                        "java",
                        "-cp",
                        directory.toString(),
                        "Runner"
                )
                        .directory(
                                directory.toFile()
                        )
                        .redirectErrorStream(true)
                        .start();

        boolean finished =
                process.waitFor(
                        5,
                        TimeUnit.SECONDS
                );

        String output =
                readProcessOutput(process);

        if (!finished) {

            process.destroyForcibly();

            throw new RuntimeException(
                    "Code execution timed out."
            );
        }

        if (process.exitValue() != 0) {

            throw new RuntimeException(
                    output
            );
        }

        return output;
    }

    // =========================================================
    // JAVA RUNNER
    // =========================================================

    private String createJavaRunner(
            Long questionId,
            int testCaseNumber
    ) {

        // -----------------------------------------------------
        // QUESTION 1 - TWO SUM
        // -----------------------------------------------------

        if (questionId == 1) {

            if (testCaseNumber == 1) {

                return """
                        import java.util.Arrays;

                        public class Runner {

                            public static void main(String[] args)
                                    throws Exception {

                                Solution solution =
                                        new Solution();

                                int[] nums =
                                        {2, 7, 11, 15};

                                int target = 9;

                                int[] result =
                                        solution.twoSum(
                                                nums,
                                                target
                                        );

                                System.out.println(
                                        Arrays.toString(result)
                                );
                            }
                        }
                        """;
            }

            if (testCaseNumber == 2) {

                return """
                        import java.util.Arrays;

                        public class Runner {

                            public static void main(String[] args)
                                    throws Exception {

                                Solution solution =
                                        new Solution();

                                int[] nums =
                                        {3, 2, 4};

                                int target = 6;

                                int[] result =
                                        solution.twoSum(
                                                nums,
                                                target
                                        );

                                System.out.println(
                                        Arrays.toString(result)
                                );
                            }
                        }
                        """;
            }
        }

        // -----------------------------------------------------
        // QUESTION 2 - VALID PARENTHESES
        // -----------------------------------------------------

        if (questionId == 2) {

            String input =
                    testCaseNumber == 1
                            ? "()[]{}"
                            : "(]";

            return """
                    import java.lang.reflect.Method;

                    public class Runner {

                        public static void main(String[] args)
                                throws Exception {

                            Solution solution =
                                    new Solution();

                            String s = "%s";

                            Method method =
                                    Solution.class.getDeclaredMethod(
                                            "isValid",
                                            String.class
                                    );

                            method.setAccessible(true);

                            Object result =
                                    method.invoke(
                                            solution,
                                            s
                                    );

                            System.out.println(result);
                        }
                    }
                    """.formatted(input);
        }

        throw new RuntimeException(
                "Invalid question ID: " + questionId
        );
    }

    // =========================================================
    // PYTHON EXECUTION
    // =========================================================

    private String executePython(
            Path directory,
            Long questionId,
            String code,
            int testCaseNumber
    ) throws Exception {

        Path solutionFile =
                directory.resolve("solution.py");

        Path runnerFile =
                directory.resolve("runner.py");

        Files.writeString(
                solutionFile,
                code.trim()
        );

        String runnerCode =
                createPythonRunner(
                        questionId,
                        testCaseNumber
                );

        Files.writeString(
                runnerFile,
                runnerCode
        );

        Process process =
                new ProcessBuilder(
                        "python",
                        "runner.py"
                )
                        .directory(
                                directory.toFile()
                        )
                        .redirectErrorStream(true)
                        .start();

        boolean finished =
                process.waitFor(
                        5,
                        TimeUnit.SECONDS
                );

        String output =
                readProcessOutput(process);

        if (!finished) {

            process.destroyForcibly();

            throw new RuntimeException(
                    "Code execution timed out."
            );
        }

        if (process.exitValue() != 0) {

            throw new RuntimeException(
                    output
            );
        }

        return output;
    }

    // =========================================================
    // PYTHON RUNNER
    // =========================================================

    private String createPythonRunner(
            Long questionId,
            int testCaseNumber
    ) {

        // -----------------------------------------------------
        // QUESTION 1
        // -----------------------------------------------------

        if (questionId == 1) {

            if (testCaseNumber == 1) {

                return """
                        from solution import Solution

                        solution = Solution()

                        nums = [2, 7, 11, 15]
                        target = 9

                        result = solution.twoSum(
                            nums,
                            target
                        )

                        print(result)
                        """;
            }

            return """
                    from solution import Solution

                    solution = Solution()

                    nums = [3, 2, 4]
                    target = 6

                    result = solution.twoSum(
                        nums,
                        target
                    )

                    print(result)
                    """;
        }

        // -----------------------------------------------------
        // QUESTION 2
        // -----------------------------------------------------

        if (questionId == 2) {

            String input =
                    testCaseNumber == 1
                            ? "()[]{}"
                            : "(]";

            return """
                    from solution import Solution

                    solution = Solution()

                    s = "%s"

                    result = solution.isValid(s)

                    print(result)
                    """.formatted(input);
        }

        throw new RuntimeException(
                "Invalid question ID: " + questionId
        );
    }

    // =========================================================
    // JAVASCRIPT EXECUTION
    // =========================================================

    private String executeJavaScript(
            Path directory,
            Long questionId,
            String code,
            int testCaseNumber
    ) throws Exception {

        Path solutionFile =
                directory.resolve("solution.js");

        Path runnerFile =
                directory.resolve("runner.js");

        Files.writeString(
                solutionFile,
                code.trim()
        );

        String runnerCode =
                createJavaScriptRunner(
                        questionId,
                        testCaseNumber
                );

        Files.writeString(
                runnerFile,
                runnerCode
        );

        Process process =
                new ProcessBuilder(
                        "node",
                        "runner.js"
                )
                        .directory(
                                directory.toFile()
                        )
                        .redirectErrorStream(true)
                        .start();

        boolean finished =
                process.waitFor(
                        5,
                        TimeUnit.SECONDS
                );

        String output =
                readProcessOutput(process);

        if (!finished) {

            process.destroyForcibly();

            throw new RuntimeException(
                    "Code execution timed out."
            );
        }

        if (process.exitValue() != 0) {

            throw new RuntimeException(
                    output
            );
        }

        return output;
    }

    // =========================================================
    // JAVASCRIPT RUNNER
    // =========================================================

    private String createJavaScriptRunner(
            Long questionId,
            int testCaseNumber
    ) {

        // -----------------------------------------------------
        // QUESTION 1
        // -----------------------------------------------------

        if (questionId == 1) {

            if (testCaseNumber == 1) {

                return """
                        const solution =
                            require("./solution");

                        const nums =
                            [2, 7, 11, 15];

                        const target = 9;

                        let result;

                        if (typeof solution === "function") {

                            result =
                                solution(
                                    nums,
                                    target
                                );

                        } else if (
                            solution &&
                            typeof solution.twoSum === "function"
                        ) {

                            result =
                                solution.twoSum(
                                    nums,
                                    target
                                );

                        } else if (
                            solution &&
                            solution.Solution
                        ) {

                            const instance =
                                new solution.Solution();

                            result =
                                instance.twoSum(
                                    nums,
                                    target
                                );

                        } else {

                            throw new Error(
                                "twoSum function not found."
                            );
                        }

                        console.log(
                            JSON.stringify(result)
                        );
                        """;
            }

            return """
                    const solution =
                        require("./solution");

                    const nums =
                        [3, 2, 4];

                    const target = 6;

                    let result;

                    if (typeof solution === "function") {

                        result =
                            solution(
                                nums,
                                target
                            );

                    } else if (
                        solution &&
                        typeof solution.twoSum === "function"
                    ) {

                        result =
                            solution.twoSum(
                                nums,
                                target
                            );

                    } else if (
                        solution &&
                        solution.Solution
                    ) {

                        const instance =
                                new solution.Solution();

                        result =
                            instance.twoSum(
                                nums,
                                target
                            );

                    } else {

                        throw new Error(
                            "twoSum function not found."
                        );
                    }

                    console.log(
                        JSON.stringify(result)
                    );
                    """;
        }

        // -----------------------------------------------------
        // QUESTION 2
        // -----------------------------------------------------

        if (questionId == 2) {

            String input =
                    testCaseNumber == 1
                            ? "()[]{}"
                            : "(]";

            return """
                    const solution =
                        require("./solution");

                    const s = "%s";

                    let result;

                    if (
                        typeof solution === "function"
                    ) {

                        result =
                            solution(s);

                    } else if (
                        solution &&
                        typeof solution.isValid === "function"
                    ) {

                        result =
                            solution.isValid(s);

                    } else if (
                        solution &&
                        solution.Solution
                    ) {

                        const instance =
                            new solution.Solution();

                        result =
                            instance.isValid(s);

                    } else {

                        throw new Error(
                            "isValid function not found."
                        );
                    }

                    console.log(result);
                    """.formatted(input);
        }

        throw new RuntimeException(
                "Invalid question ID: " + questionId
        );
    }

    // =========================================================
    // OUTPUT NORMALIZATION
    // =========================================================

    private String normalizeOutput(
            String output
    ) {

        if (output == null) {
            return "";
        }

        return output
                .trim()
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .replaceAll("\\s+", " ");
    }

    // =========================================================
    // OUTPUT COMPARISON
    // =========================================================

    private boolean outputsMatch(
            String actual,
            String expected
    ) {

        actual =
                normalizeOutput(actual);

        expected =
                normalizeOutput(expected);

        // -----------------------------------------------------
        // BOOLEAN
        // -----------------------------------------------------

        if (expected.equalsIgnoreCase("true") ||
                expected.equalsIgnoreCase("false")) {

            return actual.equalsIgnoreCase(
                    expected
            );
        }

        // -----------------------------------------------------
        // ARRAY
        // -----------------------------------------------------

        if (expected.startsWith("[") &&
                expected.endsWith("]")) {

            String cleanActual =
                    actual.replaceAll(
                            "\\s+",
                            ""
                    );

            String cleanExpected =
                    expected.replaceAll(
                            "\\s+",
                            ""
                    );

            return cleanActual.equals(
                    cleanExpected
            );
        }

        return actual.equals(
                expected
        );
    }

    // =========================================================
    // READ PROCESS OUTPUT
    // =========================================================

    private String readProcessOutput(
            Process process
    ) throws Exception {

        BufferedReader reader =
                new BufferedReader(
                        new InputStreamReader(
                                process.getInputStream()
                        )
                );

        StringBuilder output =
                new StringBuilder();

        String line;

        while (
                (line = reader.readLine()) != null
        ) {

            output.append(line)
                    .append(
                            System.lineSeparator()
                    );
        }

        return output.toString();
    }

    // =========================================================
    // DELETE TEMP DIRECTORY
    // =========================================================

    private void deleteDirectory(
            Path directory
    ) {

        if (directory == null) {
            return;
        }

        try {

            if (!Files.exists(directory)) {
                return;
            }

            Files.walk(directory)
                    .sorted(
                            Comparator.reverseOrder()
                    )
                    .forEach(path -> {

                        try {

                            Files.deleteIfExists(
                                    path
                            );

                        } catch (Exception ignored) {
                        }

                    });

        } catch (Exception ignored) {
        }
    }

    // =========================================================
    // REQUEST CLASS
    // =========================================================

    public static class CodingRunRequest {

        public Long questionId;

        public String language;

        public String code;

        /*
         * Frontend already sends testCases.
         * Backend generates and validates its own
         * test cases for security and consistency.
         */
        public List<TestCaseRequest> testCases;

        public Integer testCaseNumber;
    }

    // =========================================================
    // OPTIONAL REQUEST TEST CASE
    // =========================================================

    public static class TestCaseRequest {

        public String input;

        public String expectedOutput;
    }

    // =========================================================
    // TEST CASE DEFINITION
    // =========================================================

    public static class TestCaseDefinition {

        private final String input;

        private final String output;

        public TestCaseDefinition(
                String input,
                String output
        ) {

            this.input = input;
            this.output = output;
        }

        public String getInput() {
            return input;
        }

        public String getOutput() {
            return output;
        }
    }

    // =========================================================
    // TEST CASE RESULT
    // =========================================================

    public static class TestCaseResult {

        public int testCaseNumber;

        public boolean passed;

        public String input;

        public String expectedOutput;

        public String actualOutput;

        public TestCaseResult(
                int testCaseNumber,
                boolean passed,
                String input,
                String expectedOutput,
                String actualOutput
        ) {

            this.testCaseNumber =
                    testCaseNumber;

            this.passed =
                    passed;

            this.input =
                    input;

            this.expectedOutput =
                    expectedOutput;

            this.actualOutput =
                    actualOutput;
        }

        public boolean isPassed() {
            return passed;
        }
    }

    // =========================================================
    // RESPONSE CLASS
    // =========================================================

    public static class CodingRunResponse {

        public boolean success;

        public boolean allPassed;

        public String message;

        public List<TestCaseResult> testCases;

        public CodingRunResponse(
                boolean success,
                boolean allPassed,
                String message,
                List<TestCaseResult> testCases
        ) {

            this.success =
                    success;

            this.allPassed =
                    allPassed;

            this.message =
                    message;

            this.testCases =
                    testCases;
        }

        public static CodingRunResponse error(
                String message
        ) {

            return new CodingRunResponse(
                    false,
                    false,
                    message,
                    new ArrayList<>()
            );
        }
    }
}