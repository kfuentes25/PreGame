# Report for final project

## Four sections, in order. Total length ~800–1200 words.

### What & why (~200–250 words). What the app does, who it's for, and what's hard about getting the AI behavior right.

This app is for anybody who has to deal with the press/public in an environment similar to press conferences and they want to critique their speech or responses before they go and say it. This app takes the users input and then runs it through the OpenAI API and analyzes the risk factors it identifies in the users input and tell the user what those risk factors are before moving on. It then rewrites it to remove all of the controversial and risky things from your input and gives you a refined response that doesnt lose your core message but says it in a nicer way. Finally the app gives example questions the user could face after their initial response from a harsh reporter who's job it is to make the user respond in a negative way so that if that occurs in reality they are prepared to answer professionally. The hard part about getting the AI behavior right was to make sure that it didnt make robotic responses. It made it difficult for the input to keep its personality while still removing those risk factors that it had. They ended up giving robotic albeit good uncontroversial responses instead of the controversial input. 

### Iterations (≥3 versions, ~75–150 words each). One labeled subsection per version (V1, V2, V3, …). Each subsection must contain, in this order:

### V1: First prompt

#### Change: what you changed (prompt, model, retrieval, controls, etc.).
#### Motivating example: the specific failing case from your eval set that drove the change.
#### Delta: metric before → after on the same eval set (positive or negative — both are fine if explained).
#### Conclusion: why the metric moved (or didn't), and what you'd try next.

### V2: Refining the Look

#### Change: 
#### Motivating example: 
#### Delta: 
#### Conclusion: 

### V3: Reaching the MVP

#### Change:
#### Motivating example: 
#### Delta: 
#### Conclusion:

### Code walkthrough (200–300 words). Trace one user action through your code with file:line references. Explain one design decision and one alternative you considered and rejected. Generic "this calls the API" descriptions don't earn full credit.




### AI Disclosure and Safety

The AI coding assistant I used was Kiro. I used it to implement the majority of the project besides the report. This was a really fun experience but Kiro wasnt perfect. When I first went to implement the project, I took my time constructing a good prompt that I thought would eventually lead me to a beneficial outcome but, it ended making an ugly and ancient looking website. I had to refine my approach. Then I went and told it to make the look of the website more modern because it had failed to make it appealing and it failed again. It just changed the look of colors to be brighter but still ugly with its font and UI choices. Finaly, I decided to make it more specific. I ended up coming up with the idea of giving it an example of what kind of look I was going for and I told Kiro I was looking for something more Apple-esque. This then made the right changes I wanted. The font went from a serif to a more plain looking font so its not as ugly. It also made the look a lot more appealing and modern as I wanted previously. A few of the riskiest things that my project faces is biased output. It really takes the input and disects it even if it is an output that itself made. It really only knows how to critique and not how to analyze and accept as well.