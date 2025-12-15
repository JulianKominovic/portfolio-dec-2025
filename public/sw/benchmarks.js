const TIME_LIMIT = 1000;

function runBenchmark(code = "") {
  let totalTime = 0;
  try {
    const fn = new Function(code);
    // Warm-up run to optimize code execution
    for (let index = 0; index < 10; index++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      totalTime += end - start;
      if (totalTime > TIME_LIMIT) {
        break;
      }
    }
    totalTime = 0;
    let iterationsCompleted = 0;
    while (totalTime < TIME_LIMIT) {
      const start = performance.now();
      fn();
      const end = performance.now();
      totalTime += end - start;
      iterationsCompleted++;
    }

    const avgTime = totalTime / iterationsCompleted;
    return {
      avgTime,
      totalIterations: iterationsCompleted,
      totalTime,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

self.onmessage = (event) => {
  const { data } = event;
  const { files: _files } = data;
  const testDataFiles = _files.filter((file) => file.testData);
  const files = _files.filter((file) => !file.testData);

  let results = [];

  for (const testDataFile of testDataFiles) {
    // To initialize test data
    eval(testDataFile.value);
  }

  for (const file of files) {
    const { avgTime, error, totalIterations, totalTime } = runBenchmark(
      file.value
    );
    if (error) {
      results.push({
        file,
        error,
      });
      break;
    }
    results.push({
      file,
      avgTime,
      totalIterations,
      totalTime,
    });
  }
  self.postMessage(results);
};
