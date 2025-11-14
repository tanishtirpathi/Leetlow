import axios from "axios";

export const getJudge0LanguageId = (language) => {
  const langaugeMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return langaugeMap[language.toUpperCase()];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const JUDGE0_TIMEOUT =30000
export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    },{
      timeout: JUDGE0_TIMEOUT,
    }
  );

  console.log("Submission Results: ", data);

  return data;
};

export const PoleBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );

    const results = data.submissions;
    console.log("resultsof the wthout  -->", results);
    console.log(
      `resultsof the polebatchresults --> ${JSON.stringify(results)}`
    );
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return results;

    await sleep(1000);
  }
};
