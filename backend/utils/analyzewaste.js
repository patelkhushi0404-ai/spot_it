const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeWaste = async (imageUrl) => {
  try {
    console.log('analyzeWaste called with:', imageUrl);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    console.log('Fetching image...');
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    console.log('Image fetched, size:', base64Image.length);

    const prompt = `Analyze this waste/garbage image and provide:
1. Waste Type (e.g., Plastic Waste, Organic Waste, Medical Waste, Electronic Waste, Mixed Waste, Construction Waste)
2. Severity Level (Low, Medium, High) based on amount and hazard
3. Disposal Method (brief suggestion)
4. Environmental Impact (one sentence)

Respond in this exact JSON format only, no other text:
{
  "wasteType": "type here",
  "severity": "Low",
  "disposalMethod": "method here",
  "environmentalImpact": "impact here",
  "isWaste": true
}`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    console.log('Gemini API response received');
    const response = result.response.text();
    console.log('AI RAW RESPONSE:', response);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response');
    const parsed = JSON.parse(jsonMatch[0]);
    console.log('Parsed AI analysis:', parsed);
    return { success: true, analysis: parsed };
  } catch (error) {
    console.error('AI analysis error:', error.message);
    return { success: false, analysis: null };
  }
};

module.exports = analyzeWaste;