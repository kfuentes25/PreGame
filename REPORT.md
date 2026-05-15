# Report for final project

## Four sections, in order. Total length ~800–1200 words.

### What & why (~200–250 words). What the app does, who it's for, and what's hard about getting the AI behavior right.

This app is for anybody who has to deal with the press/public in an environment similar to press conferences and they want to critique their speech or responses before they go and say it. This app takes the users input and then runs it through the OpenAI API and analyzes the risk factors it identifies in the users input and tell the user what those risk factors are before moving on. It then rewrites it to remove all of the controversial and risky things from your input and gives you a refined response that doesnt lose your core message but says it in a nicer way. Finally the app gives example questions the user could face after their initial response from a harsh reporter who's job it is to make the user respond in a negative way so that if that occurs in reality they are prepared to answer professionally. The hard part about getting the AI behavior right was to make sure that it didnt make robotic responses. It made it difficult for the input to keep its personality while still removing those risk factors that it had. They ended up giving robotic albeit good uncontroversial responses instead of the controversial input. 

### Iterations (≥3 versions, ~75–150 words each). One labeled subsection per version (V1, V2, V3, …). Each subsection must contain, in this order:

### V1: First prompt

#### Change

This was the first version of the product. I implemented the prompt for the web app and made it so that Kiro can make something to start.

#### Motivating example

There was no specific failiing case from my eval set that drove the change but i did want to make it clear what my goals were for the project and how the AI should approach implementing it and it asked clarifying questions in order to get closer to what I wanted.

#### Delta

Positive. This is only because I went from having nothing to having a webapp and moved forward from there. I could also say negative as I dont know how the AI is going to perform yet and then ill grade the eval metric performance.

#### Conclusion

The metric moved forward and what I'm going to try next is testing the AI and how well it performs based off of my understanding of the evaluation metric.

### V2: Refining the Look

#### Change

The change came to the appearance of the app. The UI was primitive and made the app look ancient and i made it look better.

#### Motivating example

The look was very ugly. looked like an old website with times new roman font and things of the like with ugly colors. Also didnt show the risk factors or output in a way i liked

#### Delta

Positive. Made the look more appealing and showed the risk factors in a nicer way

#### Conclusion

The metric moved forward as the output and risk factors are looking good

### V3: Reaching the MVP

#### Change

Last change was that the output was not good enough. so I refined the prompts that it gave the AI so that it passed the test cases

#### Motivating example

eval metric wasnt being reached and i wanted it to be reached for at least 10 test cases

#### Delta

Positive and negative. It made the output pass the test cases but it sounds really robotic now.

#### Conclusion

I think next i'd try to change the prompt and kind of be happy with some fails because that could make the natural language shine a bit more.

### Code walkthrough (200–300 words). one alternative you considered and rejected

For the code walk through im going to explain what happens when you click the button on the webapp that says "Run Analysis". First when the button is pressed then that calls the handleSubmite() function (page.tsx:107). If its empty or it already is doing something else it bails. Otherwise it calls startTransition to keep the UI responsive while it sets isPending = true. Thats what swaps the button to "Analyzing..."(page.tsx:198). Next.js serializes the call over HTTP automatically. Then the first call begins for risk assessment (actions.ts:16). generateObject forces the model to return structured JSON matching schema via OpenAI's structured-output feature. Returns flaggedPhrases, riskFactors, severityLevel, and potentialHeadlines. Must finish before anything else the next two calls depend on it. Then the second call happens for the professional translation (actions.ts:26). generateText with the flagged phrases from Call 1 injected into the prompt. The model rewrites the statement without those phrases while keeping the same subject matter. Finally the third call happens and we get the adversarial reporter (actions.ts:38). generateText against the refined statement. Asks the model to play a hostile journalist. Verifies none of the flagged phrases appear in the refined statement (actions.ts:52). Then validates the assembled result before it leaves the server. Back in the browser (page.tsx:115) setResult triggers the three FadeCard sections to render, each fading in via IntersectionObserver with staggered delays. Page auto-scrolls to results. I didnt really ahve an alterantive that i considered but maybe it would have been what happens when the button is retriggered and how it removes the context of the previous instance and does a whole new thing.

### AI Disclosure and Safety

The AI coding assistant I used was Kiro. I used it to implement the majority of the project besides the report. This was a really fun experience but Kiro wasnt perfect. When I first went to implement the project, I took my time constructing a good prompt that I thought would eventually lead me to a beneficial outcome but, it ended making an ugly and ancient looking website. I had to refine my approach. Then I went and told it to make the look of the website more modern because it had failed to make it appealing and it failed again. It just changed the look of colors to be brighter but still ugly with its font and UI choices. Finaly, I decided to make it more specific. I ended up coming up with the idea of giving it an example of what kind of look I was going for and I told Kiro I was looking for something more Apple-esque. This then made the right changes I wanted. The font went from a serif to a more plain looking font so its not as ugly. It also made the look a lot more appealing and modern as I wanted previously. A few of the riskiest things that my project faces is biased output. It really takes the input and disects it even if it is an output that itself made. It really only knows how to critique and not how to analyze and accept as well.