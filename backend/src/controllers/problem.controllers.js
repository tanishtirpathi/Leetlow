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
    tagtags,
    example,
    constraints,
    testCases,
    codeSnipits,
    referenceSolution,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(
      400,
      "you are not admin so you are not allowed to create problem "
    );
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        throw new ApiError(400, `language${language} is not supported`);
      }

      const submission = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResult = await submitBatch(submission);

      const tokens = submissionResult.map((res) => res.token);

      console.log(`just for the sake of my mind tokens are :${tokens}`);

      const results = await PoleBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const results = results[i];
        if (results.status.id !== 3) {
          throw new ApiError(
            400,
            error,
            `Testcase${i + 1} failed for language ${language}`
          );
        }

        const newProblem = await db.problem.create({
          data: {
            title,
            descripttion,
            difficultyLevel,
            tagtags,
            example,
            constraints,
            testCases,
            codeSnipits,
            referenceSolution,
            userId: req.user.id,
          },
        });

        return new ApiResponse(201, "New problem created ", newProblem);
      }
    }
  } catch (error) {
    throw new ApiError(400, error, " create problem controller failed ");
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
