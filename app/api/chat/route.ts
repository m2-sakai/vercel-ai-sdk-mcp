import { streamText } from 'ai';
import { experimental_createMCPClient as createMCPClient } from "ai";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  try {
    // MCP ライアントの作成
    const awsMcpClient = await createMCPClient({
      transport: new StdioMCPTransport({
        command: "uvx",
        args: ["awslabs.aws-documentation-mcp-server@latest"],
        env: {
          FASTMCP_LOG_LEVEL: "ERROR"
        },
      }),
    })

    // const azMcpClient = await createMCPClient({
    //   transport: {
    //     type: "sse",
    //     url: "https://m2-sakai-azure-function-mcp.azurewebsites.net/runtime/webhooks/mcp/sse",
    //     headers: {
    //       "x-functions-key": process.env.AZURE_FUNCTIONS_KEY || "",
    //     },
    //   },
    // });
    // console.log('MCP Client:', azMcpClient);

    const playwrightMcpClient = await createMCPClient({
      transport: {
        type: "sse",
        url: "http://localhost:8931/sse"
      },
    });

    const { messages } = await req.json();

    // Schema Discovery を使用して MCP サーバーからツール定義を取得
    const awsMcpTool = await awsMcpClient.tools();
    // const azMcpTool = await azMcpClient.tools();
    const playwrightMcpTool = await playwrightMcpClient.tools();

    const tools = {
      ...awsMcpTool,
      // ...azMcpTool,
      ...playwrightMcpTool,
    }

    // Vercel AI SDK の streamText 関数を使用して LLM とのストリーミング通信を開始
    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      tools,
      onFinish: async () => {
        // ストリーミング応答が完了したら、必ず MCP クライアントの接続を閉じる
        await awsMcpClient.close();
        // await azMcpClient.close();
        await playwrightMcpClient.close();
      },
    });
    // ストリーミング応答をクライアントに返す
    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Error: ', error);
  }
}
