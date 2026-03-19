import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.DEEPSEEK_API_KEY;
console.log("API_KEY是:", API_KEY);

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "你是一个AI助手" },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();

        // ⭐ 关键：打印出来
        console.log("DeepSeek完整返回👇");
        console.log(JSON.stringify(data, null, 2));

        // ⭐ 如果API报错
        if (!response.ok) {
            return res.status(500).json({
                reply: "AI接口报错(看终端)"
            });
        }

        // ⭐ 安全取值
        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.json({
                reply: "AI没返回内容"
            });
        }

        res.json({ reply });

    } catch (err) {
        console.error("服务器错误👇", err);
        res.status(500).json({ reply: "服务器出错" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ server running at http://localhost:${PORT}`);
});