const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTU2ZTVlMzFjMGE1YTJiZWE0NGJhYmFjZTY3OTg0ZGQ4OGJmMmRjMjc5MzhjOWI1NzFmMjgxZDBiOTZmNjY0Y2E1NDRhZmQ4NTc1MmNlMmUiLCJpYXQiOjE3ODE1NTc3ODUuMzQzOTY5LCJuYmYiOjE3ODE1NTc3ODUuMzQzOTcsImV4cCI6NDkzNzIzMTM4NS4zMzgyMzcsInN1YiI6Ijc1OTg0OTYxIiwic2NvcGVzIjpbInRhc2sucmVhZCIsInRhc2sud3JpdGUiXX0.aPTXWiKgz0To2tNYdcNux5tTSPyStte6yrA2oLW7CNKz5q3uwgWVEeJsLqUpc2xk9E3vGY9sAc6dojqF8dsXz4qW7jh7x9NmWM_R_0m1zyWz7GLKVnz6VZh9WoHZyGm4edRBi5THl3jct3IOiebowdsLjf2OUz71vkJLKDESZf02e3DUe53cvA1hHoDWOgUeGWUfrlblnR8p5ruhWs_bZphU18c-mpM8pLbmyXbV5UM6Yv4xy1Rbp-BWX-eB3m_9G7nHSohIRH0v8vLwdZjqWr5lGbwdplxzCFbbJpyVWk7_BH9HhQmOYNC4poaOgE1VjyJME3lSMWlrqjkaetuSpnu78fumyCGGABoPgJddt41_tMzREuAn-j-YvkspWVirEi6UtOHoQJ1-PfeLVsrDuVb_rOKkWLF8EStmozqCRNXIbjER0PKvkGgtWnQPMpppX7nAG4NM2nVGjLs5CBzOeRYCoBoBFj3lgQU5Tk2BtRpqo5fYH4_fedtOTgen06dnF3zxX53-8BHyKdvrN42dmMrN3okMXJA374c-tTRjvWYDyJ5xyCPzXKGNDATgCE88njEBQyGSGfL_nvaODGQIAoOx9RCj5Ea0VRGGXPOmVdfgm8ejFRiI7_cQYzrD1ueQT1Du9RUNot8o-dkJR_FniUfbApiQMiYoKmDgN_Tzdpw"; // keep your real key private

document.getElementById("convertBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const format = document.getElementById("formatSelect").value;
  const result = document.getElementById("result");

  if (!fileInput.files.length) {
    result.textContent = "⚠️ Please choose a file first.";
    result.style.color = "#ff9800";
    return;
  }

  const file = fileInput.files[0];
  const fileName = file.name;
  result.textContent = `⏳ Uploading and converting ${fileName} to ${format.toUpperCase()}...`;
  result.style.color = "#00bcd4";

  try {
    // Step 1: Create job
    const jobResponse = await fetch("https://api.cloudconvert.com/v2/jobs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tasks: {
          "import-my-file": { operation: "import/upload" },
          "convert-my-file": {
            operation: "convert",
            input: "import-my-file",
            output_format: format
          },
          "export-my-file": {
            operation: "export/url",
            input: "convert-my-file"
          }
        }
      })
    });

    const jobData = await jobResponse.json();
    const uploadTask = jobData.data.tasks.find(t => t.name === "import-my-file");

    // Step 2: Upload file to CloudConvert
    const uploadUrl = uploadTask.result.form.url;
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: (() => {
        const formData = new FormData();
        Object.entries(uploadTask.result.form.parameters).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("file", file);
        return formData;
      })()
    });

    if (!uploadResponse.ok) throw new Error("Upload failed");

    // Step 3: Wait for conversion to finish
    const jobId = jobData.data.id;
    let statusData;
    do {
      const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      statusData = await statusResponse.json();
      await new Promise(r => setTimeout(r, 2000)); // wait 2s before checking again
    } while (statusData.data.status !== "finished");

    // Step 4: Get download link
    const exportTask = statusData.data.tasks.find(t => t.name === "export-my-file");
    const fileUrl = exportTask.result.files[0].url;

    // Step 5: Show success and download button
    result.innerHTML = `✅ Successfully converted ${fileName} to ${format.toUpperCase()}!<br><br>
      <a href="${fileUrl}" id="downloadBtn" class="download-btn" download>Download Converted File</a>`;
    result.style.color = "#4caf50";

    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.style.display = "inline-block";
    downloadBtn.style.background = "linear-gradient(135deg, #4caf50, #2e7d32)";
    downloadBtn.style.color = "#fff";
    downloadBtn.style.padding = "12px 28px";
    downloadBtn.style.borderRadius = "8px";
    downloadBtn.style.textDecoration = "none";
    downloadBtn.style.fontWeight = "600";
    downloadBtn.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
    downloadBtn.style.transition = "all 0.3s ease";
    downloadBtn.onmouseover = () => {
      downloadBtn.style.background = "linear-gradient(135deg, #43a047, #1b5e20)";
      downloadBtn.style.transform = "scale(1.05)";
    };
    downloadBtn.onmouseout = () => {
      downloadBtn.style.background = "linear-gradient(135deg, #4caf50, #2e7d32)";
      downloadBtn.style.transform = "scale(1)";
    };
  } catch (error) {
    console.error(error);
    result.textContent = "❌ Conversion failed. Please try again.";
    result.style.color = "#f44336";
  }
});
