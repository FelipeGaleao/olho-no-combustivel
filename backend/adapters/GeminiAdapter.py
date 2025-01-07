import google.generativeai as genai
import os
import base64
from PIL import Image
import uuid
import tempfile
from pydantic import BaseModel
from typing import Optional


class CombustiveisSchema(BaseModel):
    gasolina: Optional[float]
    gasolina_aditivada: Optional[float]
    etanol: Optional[float]
    etanol_aditivado: Optional[float]
    diesel_s500: Optional[float]
    diesel_s10: Optional[float]


class responseImageProcessed(BaseModel):
    debito: CombustiveisSchema
    credito: CombustiveisSchema
    informacoes: list[str]

    class Config:
        arbitrary_types_allowed = True


class GeminiAdapter:
    def __init__(self, model_name: str = "gemini-1.5-flash-latest", prompt_template: str = None):
        self.model = genai.GenerativeModel(model_name=model_name)
        self.prompt = prompt_template

    def answer_with_text(self, prompt: str, answer: str):
        return self.model.generate_content(prompt)

    def answer_with_image(self, prompt: str, images: list[str]):
        image_parts = []
        for image_path in images:
            image_file_name = f"image_{uuid.uuid4()}.png"
            # Abre o arquivo para escrita em modo binário
            with open(image_file_name, "wb") as image_file:
                image_file.write(base64.b64decode(image_path))

            # Reabre o arquivo para leitura em modo binário
            with open(image_file_name, "rb") as image_file:
                image_to_append = {
                    'mime_type': 'image/png',
                    'data': base64.b64encode(image_file.read()).decode('utf-8')
                }
            image_parts.append(image_to_append)

            # Opcional: remover o arquivo temporário
            os.remove(image_file_name)
            
        response = self.model.generate_content([prompt, *image_parts],   
            generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=responseImageProcessed
        ))
        return response.text