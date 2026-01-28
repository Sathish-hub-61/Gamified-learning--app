// ========================================
// GAME DATA - Embedded Scenarios
// Bypasses CORS restrictions for local files
// ========================================

const ECO_SCENARIOS = {
    scenarios: [
        {
            id: 1,
            level: 1,
            type: "choice",
            question: "You see a plastic bottle on the ground. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Pick it up and put it in the recycling bin",
                    correct: true,
                    feedback: "Great job! Recycling helps keep our planet clean!",
                    points: 10
                },
                {
                    id: "b",
                    text: "Leave it there",
                    correct: false,
                    feedback: "Plastic takes hundreds of years to decompose. Let's recycle it!",
                    points: 0
                }
            ]
        },
        {
            id: 2,
            level: 1,
            type: "choice",
            question: "You're brushing your teeth. What should you do with the water?",
            options: [
                {
                    id: "a",
                    text: "Turn off the tap while brushing",
                    correct: true,
                    feedback: "Awesome! You can save up to 8 gallons of water per day!",
                    points: 10
                },
                {
                    id: "b",
                    text: "Keep the water running",
                    correct: false,
                    feedback: "Turning off the tap saves precious water. Every drop counts!",
                    points: 0
                }
            ]
        },
        {
            id: 3,
            level: 2,
            type: "choice",
            question: "Your family is going to the grocery store. How should you carry items?",
            options: [
                {
                    id: "a",
                    text: "Bring reusable bags from home",
                    correct: true,
                    feedback: "Perfect! Reusable bags reduce plastic waste significantly!",
                    points: 15
                },
                {
                    id: "b",
                    text: "Use new plastic bags each time",
                    correct: false,
                    feedback: "Plastic bags harm wildlife and pollute oceans. Reusable bags are better!",
                    points: 0
                }
            ]
        },
        {
            id: 4,
            level: 2,
            type: "choice",
            question: "You're leaving a room. What should you do with the lights?",
            options: [
                {
                    id: "a",
                    text: "Turn them off",
                    correct: true,
                    feedback: "Excellent! Saving electricity helps reduce pollution!",
                    points: 15
                },
                {
                    id: "b",
                    text: "Leave them on",
                    correct: false,
                    feedback: "Turning off lights saves energy and helps the environment!",
                    points: 0
                }
            ]
        },
        {
            id: 5,
            level: 3,
            type: "choice",
            question: "You want to plant something in your garden. What's the best choice?",
            options: [
                {
                    id: "a",
                    text: "Plant a tree that provides fruit and shade",
                    correct: true,
                    feedback: "Amazing! Trees clean the air and provide food for animals!",
                    points: 20
                },
                {
                    id: "b",
                    text: "Just keep the grass",
                    correct: false,
                    feedback: "Trees are super important! They give us oxygen and help cool the planet!",
                    points: 0
                }
            ]
        },
        {
            id: 6,
            level: 3,
            type: "choice",
            question: "You have old clothes that don't fit. What should you do?",
            options: [
                {
                    id: "a",
                    text: "Donate them or give to someone who needs them",
                    correct: true,
                    feedback: "Wonderful! Reusing clothes reduces waste and helps others!",
                    points: 20
                },
                {
                    id: "b",
                    text: "Throw them in the trash",
                    correct: false,
                    feedback: "Donating clothes helps people and reduces landfill waste!",
                    points: 0
                }
            ]
        },
        {
            id: 7,
            level: 4,
            type: "choice",
            question: "You see someone littering in the park. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Politely remind them about keeping the park clean",
                    correct: true,
                    feedback: "You're an Eco Hero! Spreading awareness helps everyone!",
                    points: 25
                },
                {
                    id: "b",
                    text: "Ignore it",
                    correct: false,
                    feedback: "Speaking up kindly can inspire others to care for our planet!",
                    points: 0
                }
            ]
        },
        {
            id: 8,
            level: 4,
            type: "choice",
            question: "Your school is organizing a cleanup drive. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Join and encourage friends to participate",
                    correct: true,
                    feedback: "Incredible! Community action creates real change!",
                    points: 25
                },
                {
                    id: "b",
                    text: "Skip it and play games instead",
                    correct: false,
                    feedback: "Working together makes our community cleaner and healthier!",
                    points: 0
                }
            ]
        },
        {
            id: 9,
            level: 5,
            type: "choice",
            question: "You're buying a new water bottle. Which one is best for the environment?",
            options: [
                {
                    id: "a",
                    text: "A reusable stainless steel bottle",
                    correct: true,
                    feedback: "Perfect choice! One reusable bottle can replace thousands of plastic ones!",
                    points: 30
                },
                {
                    id: "b",
                    text: "Keep buying disposable plastic bottles",
                    correct: false,
                    feedback: "Reusable bottles save money and protect our oceans!",
                    points: 0
                }
            ]
        },
        {
            id: 10,
            level: 5,
            type: "choice",
            question: "You want to learn more about climate change. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Research and share what you learn with others",
                    correct: true,
                    feedback: "You're a true Eco Hero! Knowledge is power for change!",
                    points: 30
                },
                {
                    id: "b",
                    text: "Think it's too complicated to understand",
                    correct: false,
                    feedback: "Learning about our planet helps us protect it better!",
                    points: 0
                }
            ]
        }
    ]
};

const SAFETY_SCENARIOS = {
    scenarios: [
        {
            id: 1,
            level: 1,
            type: "choice",
            question: "A stranger offers you candy and asks you to go with them. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Say 'No, thank you' and walk away quickly",
                    correct: true,
                    feedback: "Great decision! Never go anywhere with strangers.",
                    points: 10
                },
                {
                    id: "b",
                    text: "Take the candy and follow them",
                    correct: false,
                    feedback: "Always say no to strangers and tell a trusted adult.",
                    points: 0
                }
            ]
        },
        {
            id: 2,
            level: 1,
            type: "choice",
            question: "Someone you don't know well asks for your home address. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Don't share it and tell a parent or teacher",
                    correct: true,
                    feedback: "Perfect! Personal information should stay private.",
                    points: 10
                },
                {
                    id: "b",
                    text: "Tell them your address",
                    correct: false,
                    feedback: "Never share personal information with people you don't know well.",
                    points: 0
                }
            ]
        },
        {
            id: 3,
            level: 2,
            type: "choice",
            question: "You're home alone and someone knocks on the door. What should you do?",
            options: [
                {
                    id: "a",
                    text: "Don't open the door and call a parent",
                    correct: true,
                    feedback: "Smart choice! Safety first when you're home alone.",
                    points: 15
                },
                {
                    id: "b",
                    text: "Open the door to see who it is",
                    correct: false,
                    feedback: "Never open the door when you're alone. Call a trusted adult.",
                    points: 0
                }
            ]
        },
        {
            id: 4,
            level: 2,
            type: "choice",
            question: "Someone online asks to meet you in person. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Tell your parents immediately",
                    correct: true,
                    feedback: "Excellent! Always involve parents in online interactions.",
                    points: 15
                },
                {
                    id: "b",
                    text: "Agree to meet them",
                    correct: false,
                    feedback: "Online friends should stay online. Always tell your parents.",
                    points: 0
                }
            ]
        },
        {
            id: 5,
            level: 3,
            type: "choice",
            question: "A friend wants you to keep a secret that makes you uncomfortable. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Tell a trusted adult about it",
                    correct: true,
                    feedback: "Brave choice! Some secrets should never be kept.",
                    points: 20
                },
                {
                    id: "b",
                    text: "Keep the secret no matter what",
                    correct: false,
                    feedback: "If a secret makes you uncomfortable, always tell a trusted adult.",
                    points: 0
                }
            ]
        },
        {
            id: 6,
            level: 3,
            type: "choice",
            question: "You get separated from your family in a crowded place. What should you do?",
            options: [
                {
                    id: "a",
                    text: "Stay where you are and ask a store employee for help",
                    correct: true,
                    feedback: "Perfect! Staying put and finding an employee is the safest choice.",
                    points: 20
                },
                {
                    id: "b",
                    text: "Wander around looking for them",
                    correct: false,
                    feedback: "Stay in one place so your family can find you more easily.",
                    points: 0
                }
            ]
        },
        {
            id: 7,
            level: 4,
            type: "choice",
            question: "Someone touches you in a way that feels wrong. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Say 'Stop!' loudly and tell a trusted adult immediately",
                    correct: true,
                    feedback: "You're absolutely right! Your body belongs to you.",
                    points: 25
                },
                {
                    id: "b",
                    text: "Stay quiet and don't tell anyone",
                    correct: false,
                    feedback: "Always speak up and tell someone you trust. It's never your fault.",
                    points: 0
                }
            ]
        },
        {
            id: 8,
            level: 4,
            type: "choice",
            question: "An adult asks you to help find their lost pet in a secluded area. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Politely decline and suggest they ask another adult",
                    correct: true,
                    feedback: "Smart thinking! Adults should ask other adults for help.",
                    points: 25
                },
                {
                    id: "b",
                    text: "Go with them to help",
                    correct: false,
                    feedback: "Adults shouldn't ask children for help. This could be a trick.",
                    points: 0
                }
            ]
        },
        {
            id: 9,
            level: 5,
            type: "choice",
            question: "You see someone being bullied at school. What should you do?",
            options: [
                {
                    id: "a",
                    text: "Tell a teacher and offer support to the person being bullied",
                    correct: true,
                    feedback: "You're a true hero! Standing up for others takes courage.",
                    points: 30
                },
                {
                    id: "b",
                    text: "Ignore it and walk away",
                    correct: false,
                    feedback: "Speaking up helps stop bullying and supports those who need it.",
                    points: 0
                }
            ]
        },
        {
            id: 10,
            level: 5,
            type: "choice",
            question: "Someone sends you inappropriate pictures online. What do you do?",
            options: [
                {
                    id: "a",
                    text: "Don't respond, block them, and tell your parents immediately",
                    correct: true,
                    feedback: "Perfect response! You handled this very maturely.",
                    points: 30
                },
                {
                    id: "b",
                    text: "Keep it to yourself",
                    correct: false,
                    feedback: "Always tell a trusted adult about inappropriate online content.",
                    points: 0
                }
            ]
        }
    ]
};

// Export for global access
window.ECO_SCENARIOS = ECO_SCENARIOS;
window.SAFETY_SCENARIOS = SAFETY_SCENARIOS;
