export interface UrlExtractionResult {
  title: string;
  text: string;
}

export class UrlExtractor {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl || import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  }

  async extractTextFromUrl(url: string): Promise<UrlExtractionResult> {
    try {
      console.log(url);

      const response = await fetch(`${this.baseUrl}/getTextByURL`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      if (!response.ok) {
        console.log(response);

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.content || `Failed to extract content: ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.content || typeof result.content !== "object") {
        throw new Error("Invalid response format from server");
      }

      return {
        title: result.content.title || "Untitled Document",
        text: result.content.text || "",
      };
    } catch (error) {
      console.error("[UrlExtractor] Error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to extract text from URL");
    }
  }

  // Validate URL format
  static isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url.trim());
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  }

  // Retry logic with exponential backoff
  async extractWithRetry(
    url: string,
    maxRetries: number = 3
  ): Promise<UrlExtractionResult> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `[UrlExtractor] Attempt ${attempt} for URL: ${url}`
        );
        return await this.extractTextFromUrl(url);
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Unknown error");

        if (attempt === maxRetries) {
          console.error(
            `[UrlExtractor] Max retries reached for URL: ${url}`
          );
          break;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.warn(
          `[UrlExtractor] Retry in ${delay}ms due to error: ${lastError.message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}
