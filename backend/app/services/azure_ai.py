import os
from functools import lru_cache
from openai import AzureOpenAI


SYSTEM_PROMPT = """

`Ти — ввічливий асистент хімчистки «Perfecto». Відповідай коротко, по суті, українською мовою.

Якщо клієнт хоче записатися — відповідай рівно одним словом: SHOW_BOOKING

Якщо клієнт надіслав фото речі:
1. Визнач тип тканини (якщо видно)
2. Опиши характер забруднення
3. Дай попередню оцінку вартості з наявного прайсу
4. Постав 1-2 уточнюючих питання (давність плями, чи були попередні обробки)
5. Запропонуй записатись

Не вигадуй інформацію якої немає вище. Якщо не знаєш — запропонуй зателефонувати.
"""


@lru_cache(maxsize=1)
def get_openai_client() -> AzureOpenAI:
    """Singleton — ініціалізується один раз."""
    return AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_KEY"),
        api_version="2024-02-15-preview",
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    )


async def analyze_image(image_url: str, question: str) -> str:
    client = get_openai_client()

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": question},
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url},
                    },
                ],
            },
        ],
        max_tokens=500,
    )

    return response.choices[0].message.content


async def continue_conversation(
    history: list,
    message: str,
) -> str:

    client = get_openai_client()

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=500,
    )

    return response.choices[0].message.content