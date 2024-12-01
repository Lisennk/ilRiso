const llmClient = require('../util/openRouterApiClient');
const config = require('config');
const modelName = config.get('codeModelName') || 'nvidia/llama-3.1-nemotron-70b-instruct';

console.log(modelName);

class Intervention {
    static async createStateDescription(state) {
        const messages = [
            {
                role: 'system',
                content: `You are an AI specializing in triage and mental health. Your task is to create a clear, concise summary of a patient's situation based on their initial description and their answers to follow-up questions.`
            },
            {
                role: 'user',
                content: `Here is the patient's initial description:
<patient_issue>
${state.prompt}
</patient_issue>

Here are the follow-up questions and answers:
${state.details.map(detail => `Q: ${detail.question}\nA: ${detail.response}`).join('\n\n')}

Based on all this information, provide a single paragraph that summarizes the patient's situation. Be concise but include relevant details. Output only the paragraph, nothing else.`
            }
        ];

        const completion = await llmClient.chat.completions.create({
            model: modelName,
            messages: messages
        });

        return completion.choices[0].message.content;
    }

    static async createInterventionDescription(stateDescription) {
        const messages = [
            {
                role: 'system',
                content: `You are a skilled CBT therapist. Your task is to create a description of a multi-step interactive mental health exercise for a user going through a difficult time. We will create that exercise and render it in the user's browser.
                
- Don't create anything that requires something beyond simple forms and buttons
- Avoid any animations, use simple instructions and descriptions instead
- Avoid button names that suggest that some sort of animation will begin
- The result should be a loical step-by-step instruction

                # Examples

## Example 1

### User Issue 

The user is experiencing insomnia.

### Planning

The user mentioned that they can't fall asleep because of anxiety. To address that, we will first give them a thought-reframing exercise. Then we will ask them to do a square breathing exercise. Before that, let's reassure them that they are not alone in this, and that we are here to support them. During that reassurance, we can also explain the strategy we chose.

### Detailed Description

**Screen 1: "It's Okay"**

**Text:**  
"It's completely normal to feel anxious sometimes, and you're not alone in this. Anxiety can make it hard to sleep, but there are techniques we can use to calm the mind and body. Together, we'll try a few simple exercises that can help you relax and prepare for sleep."  

**Action:**  
[Continue]  

---

**Screen 2: "Identify One Worry"**

**Text:**  
"Let's start by identifying one worry that's keeping you awake. Writing it down can make it feel more manageable."  

**Field:**  
A text box labeled: *"What's on your mind?"*  

**Below the Field:**  
"Take your time. Just a sentence or two is enough."  

**Action:**  
[Continue]  

---

**Screen 3: "Challenge the Worry"**

**Text:**  
"Now, let's challenge that worry by thinking about it differently. Answer these three questions to reframe your thoughts:"  

**Fields:**  
1. *"What evidence do I have that this worry will come true?"*  
   [Text box for input]  
2. *"Is there another way to look at this situation?"*  
   [Text box for input]  
3. *"What's the best outcome that could happen?"*  
   [Text box for input]  

**Action:**  
[Continue]  

---

**Screen 4: "Introduce Square Breathing"**

**Text:**  
"Great job on reframing! Now, let's try a breathing exercise to help your body relax. It's called square breathing. Follow these steps:"  

**Instruction List:**  
- Inhale deeply through your nose for 4 seconds  
- Hold your breath for 4 seconds  
- Exhale slowly through your mouth for 4 seconds  
- Hold your breath again for 4 seconds  

**Action:**  
[Start Exercise]  

---

**Screen 5: "Now Take a Deep Breath"**

**Text:**  
"Great work! Now, take a deep breath and gently close your eyes. Let yourself sink into the calm you've created. You deserve rest and relaxation."  

**Action:**  
No action here, it's the last step`
            },
            {
                role: 'user',
                content: `The user's issue is:
<user_issue>
${stateDescription}
</user_issue>

First, analyze the issue and plan the intervention. Then create a highly detailed description that can be passed to a React developer.`          }
        ];

        const completion = await llmClient.chat.completions.create({
            model: modelName,
            messages: messages
        });

        return completion.choices[0].message.content;
    }

    static async createImplementationCode(interventionDescription) {
        const messages = [
            {
                role: 'system',
                content: `You are an expert full-stack developer. Your task is to create a simple, clean implementation of a React-based web application that displays and guides users through a CBT exercise. Assume the user knows nothing about CBT and has no prior experience, so each step should be well explained and easy to use.

- Make sure the React app is interactive and functional by creating state when needed and having no required props
- If you use any imports from React like useState or useEffect, make sure to import them directly
- Use TypeScript as the language for the React component
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. 'h-[600px]'). Make sure to use a consistent color palette.
- Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
- Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. DO NOT START WITH \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`.
- The app should be full screen and tailore for mobile. Use .min-h-screen, .h-full and .w-full
- Don't use placeholders as labels

There are some prestyled components available for use. Please use your best judgement to use any of these components if the app calls for one.

Here are the components that are available, along with how to import them, and how to use them:

    
          <component>
          <name>
          Avatar
          </name>
          <import-instructions>
          
import { Avatar, AvatarFallback, AvatarImage } from "/components/ui/avatar";

          </import-instructions>
          <usage-instructions>
          
<Avatar>
  <AvatarImage src="https://github.com/nutlope.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

          </usage-instructions>
          </component>
        

          <component>
          <name>
          Button
          </name>
          <import-instructions>
          
import { Button } from "/components/ui/button"

          </import-instructions>
          <usage-instructions>
          
<Button>A normal button</Button>
<Button variant='secondary'>Button</Button>
<Button variant='destructive'>Button</Button>
<Button variant='outline'>Button</Button>
<Button variant='ghost'>Button</Button>
<Button variant='link'>Button</Button>

          </usage-instructions>
          </component>
        

          <component>
          <name>
          Card
          </name>
          <import-instructions>
          
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/components/ui/card"
 
          </import-instructions>
          <usage-instructions>
          
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>

          </usage-instructions>
          </component>
        

          <component>
          <name>
          Input
          </name>
          <import-instructions>
          
import { Input } from "/components/ui/input"

          </import-instructions>
          <usage-instructions>
          
<Input />

          </usage-instructions>
          </component>
        

          <component>
          <name>
          Label
          </name>
          <import-instructions>
          
import { Label } from "/components/ui/label"

          </import-instructions>
          <usage-instructions>
          
<Label htmlFor="email">Your email address</Label>

          </usage-instructions>
          </component>
        

          <component>
          <name>
          RadioGroup
          </name>
          <import-instructions>
          
import { Label } from "/components/ui/label"
import { RadioGroup, RadioGroupItem } from "/components/ui/radio-group"

          </import-instructions>
          <usage-instructions>
          
<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>

          </usage-instructions>
          </component>
        

          <component>
          <name>
          Select
          </name>
          <import-instructions>
          
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

          </import-instructions>
          <usage-instructions>
          
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>

          </usage-instructions>
          </component>
        

          <component>
          <name>
          Textarea
          </name>
          <import-instructions>
          
import { Textarea } from "@/components/ui/textarea"

          </import-instructions>
          <usage-instructions>
          
<Textarea />

          </usage-instructions>
          </component>
        
    
    NO OTHER LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.`
            },
            {
                role: 'user',
                content: `Create a simple React implementation to display this CBT exercise:
<exercise>
${interventionDescription}
</exercise>

Provide only the code for a single React component file. Do not include any comments.`
            }
        ];

        const completion = await llmClient.chat.completions.create({
            model: modelName,
            messages: messages
        });

        return completion.choices[0].message.content;
    }

    static async createIntervention(state) {
        const stateDescription = await this.createStateDescription(state);
        console.log({stateDescription});
        const interventionDescription = await this.createInterventionDescription(stateDescription);
        console.log({interventionDescription});
        let interventionImplementation = await this.createImplementationCode(interventionDescription);
        return interventionImplementation.replace(/\@\/components/g, '\/components');
    }

}

module.exports = Intervention;
