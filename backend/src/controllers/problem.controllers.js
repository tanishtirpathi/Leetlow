import { db } from "../libs/db.js";
import { ApiError } from "../libs/apierror.js";
import { ApiResponse } from "../libs/apiresponse.js";
import {
  getJudge0LanguageId,
  PoleBatchResults,
  submitBatch,
} from "../libs/judge0.js";
const createProblem = async (req, res) => {
  const {
    title,
    descripttion,
    difficultyLevel,
    tag,
    example,
    constraints,
    testCases,
    codeSnipits,
    referenceSolution,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(400, "Only admin can create problems");
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await PoleBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        // console.log(
        //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        // );
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        descripttion,
        difficultyLevel,
        tag,  
        example,
        constraints,
        testCases,
        codeSnipits,
        referenceSolution,
        userId: req.user.id,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "New problem created", newProblem));
  } catch (error) {
    console.error("Error in createProblem:", error);
    throw new ApiError(400, error.message || "Create problem failed");
  }
};

const getALlProblm = async (req, res) => {
  return console.log("hey this is the problem create controller");
};

const getProblemById = async (req, res) => {
  return console.log("hey this is the problem create controller");
};

const updateProblemById = async (req, res) => {
  return console.log("hey this is the problem create controller");
};

const getSolvedProblemByUser = async (req, res) => {
  return console.log("hey this is the problem create controller");
};
const deleteProblemById = async (req, res) => {
  return console.log("hey this is the problem create controller");
};

export {
  createProblem,
  deleteProblemById,
  getALlProblm,
  updateProblemById,
  getProblemById,
  getSolvedProblemByUser,
};
