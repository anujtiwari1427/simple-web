import { BlogPost } from "@/types";

export const initialBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "mastering-dynamic-programming-framework",
    title: "Mastering Dynamic Programming: The 4-Step Framework Every Beginner Needs",
    summary: "Stop memorizing LeetCode solutions. Learn how to break down any DP problem from brute force recursion to memoization and space-optimized tabulation.",
    content: `
Dynamic Programming (DP) is widely regarded as the most intimidating topic in coding interviews. When students see a problem with words like "minimum cost", "maximum profit", or "number of unique ways", panic sets in.

Here is the secret: **Dynamic Programming is simply recursion without redundant re-work.**

Whenever a recursive solution solves the exact same sub-problem more than once, we cache the result. That is all there is to it.

---

### The 4-Step DP Framework

Whenever you encounter a potential DP problem, follow this exact four-step recipe:

#### Step 1: Define the Objective and State
Ask yourself: *What state uniquely describes the situation at index \`i\`?*
- For 1D problems: \`dp[i]\` = optimal answer considering items up to index \`i\`.
- For 2D grid problems: \`dp[i][j]\` = optimal answer reaching cell \`(i, j)\`.
- For Knapsack: \`dp[i][w]\` = maximum value using items \`0..i\` with remaining weight \`w\`.

#### Step 2: Formulate the Recurrence Relation
Think about the decision you must make at each step:
- Do I pick this element or skip it?
- Do I take the step from \`i - 1\` or from \`i - 2\`?

\`\`\`python
# Example: Climbing Stairs (Fibonacci variation)
# You can climb 1 or 2 steps.
# Ways to reach step i = (Ways to reach i-1) + (Ways to reach i-2)

def climb_stairs_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 2:
        return n
    
    memo[n] = climb_stairs_memo(n - 1, memo) + climb_stairs_memo(n - 2, memo)
    return memo[n]
\`\`\`

#### Step 3: Identify Base Cases
What is the smallest problem where the answer is trivial?
- \`dp[0] = 0\` or \`dp[0] = 1\`
- For out-of-bounds indices, return \`0\` or \`float('inf')\` depending on whether you are maximizing or minimizing.

#### Step 4: Optimize Space Complexity (Tabulation to O(1))
Notice that to compute \`dp[i]\`, you usually only need the previous one or two states (\`dp[i-1]\` and \`dp[i-2]\`). You don't need to store an entire array of size \`N\`!

\`\`\`python
def climb_stairs_optimized(n: int) -> int:
    if n <= 2:
        return n
    
    prev2 = 1 # step 1
    prev1 = 2 # step 2
    
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
        
    return prev1
\`\`\`

---

### Key Patterns to Recognize in Interviews

| Pattern Name | Signature Indicator | Classic Problems |
| :--- | :--- | :--- |
| **0/1 Knapsack** | Capacity limit, choices to include/exclude | Subset Sum, Partition Equal Subset |
| **Unbounded Knapsack**| Unlimited reuse of elements | Coin Change (Min coins, combinations) |
| **Longest Common Subsequence (LCS)** | Comparing two strings or sequences | Edit Distance, Longest Palindromic Substring |
| **Grid Path Finding** | Moving right / down in a matrix | Unique Paths, Minimum Path Sum |

---

### Pro Tip for Indian Campus Placements
Don't jump straight into writing the bottom-up table on the whiteboard. Top interviewers want to see your thought process. 
1. Explain the brute-force recursion first ($O(2^n)$).
2. Draw the recursive decision tree to demonstrate redundant overlapping branches.
3. Add memoization ($O(n)$ time, $O(n)$ space).
4. Then deliver the space-optimized iterative version. This demonstrates mastery!
`,
    coverImage: "https://images.unsplash.com/photo-1516116211227-bbc042942f74?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Siddharth (Code Decoded)",
      role: "Lead Educator & Software Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
    },
    publishedAt: "2026-10-18",
    readingTimeMinutes: 6,
    tags: ["DSA", "Dynamic Programming", "Interview Prep", "Python"],
    viewsCount: 14200
  },
  {
    id: "blog-2",
    slug: "nextjs-server-components-mental-model",
    title: "Demystifying Next.js Server Components vs Client Components (The Mental Model)",
    summary: "Struggling with 'use client' errors and hydration mismatches? Here is the crystal clear mental model for React Server Components.",
    content: `
When developers upgrade from React 18 / Create-React-App to modern Next.js with App Router, confusion is common:

* "Why can't I use \`useState\` here?"
* "When should I put \`'use client'\`?"
* "Does \`'use client'\` mean the component is only rendered on the browser?"

Let's decode this once and for all.

---

### The Fundamental Shift: Server by Default

In Next.js App Router, **every single component inside the \`app/\` directory is a Server Component by default.**

What does that mean?
1. It runs **only on the server**.
2. Its JavaScript code is **never bundled or sent to the client's browser**.
3. You can directly \`fetch\` from your database, query Postgres, or access secret API keys without exposing them to the client.

\`\`\`tsx
// app/dashboard/page.tsx - SERVER COMPONENT (Default)
import { db } from "@/lib/db";

export default async function DashboardPage() {
  // Direct database query! No API route needed!
  const users = await db.user.findMany();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Directory</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

---

### What Does \`'use client'\` Really Mean?

A common misconception is that \`'use client'\` makes a component run *only* in the browser. That is false!

\`'use client'\` actually defines a **boundary**. It signals to the bundler:
> *"Everything below this boundary needs interactivity (state, event listeners, browser APIs) and must be included in the client JavaScript bundle."*

Client Components are still pre-rendered on the server into HTML during initial page load, and then "hydrated" with JavaScript on the client.

\`\`\`tsx
"use client"; // Marked as client boundary

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button 
      onClick={() => setCount(count + 1)}
      className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-lg shadow-lg hover:bg-cyan-400 transition"
    >
      Clicked {count} times
    </button>
  );
}
\`\`\`

---

### Cheat Sheet: When to Use What?

| Requirement | Use Server Component | Use Client Component (\`'use client'\`) |
| :--- | :---: | :---: |
| Fetching data from database or backend | ✅ | ❌ |
| Accessing backend secrets / API tokens | ✅ | ❌ |
| Interactive state (\`useState\`, \`useReducer\`) | ❌ | ✅ |
| Event listeners (\`onClick\`, \`onChange\`) | ❌ | ✅ |
| Lifecycle hooks (\`useEffect\`) | ❌ | ✅ |
| Browser-only APIs (\`localStorage\`, \`window\`) | ❌ | ✅ |
| Heavy dependencies that don't need client state | ✅ (Reduces JS bundle!) | ❌ |

---

### The Golden Rule: Push Leaves to the Edge

Always keep your pages and layouts as **Server Components**, and only import Client Components as small "leaves" on the outside branches of your tree.

This keeps your initial page load instantaneous, optimizes Google Core Web Vitals, and ensures your application stays snappy even on 4G networks in India.
`,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Siddharth (Code Decoded)",
      role: "Lead Educator & Software Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
    },
    publishedAt: "2026-10-24",
    readingTimeMinutes: 5,
    tags: ["Next.js", "React", "Frontend", "Web Dev"],
    viewsCount: 19800
  },
  {
    id: "blog-3",
    slug: "python-data-science-pandas-numpy-cheatsheet",
    title: "Python for Data Science: The Essential Cheatsheet for Pandas & NumPy",
    summary: "The 20% of Pandas and NumPy syntax that handles 80% of real-world data engineering and machine learning workflows.",
    content: `
When getting started with Data Science, students often spend months memorizing obscure statistical methods instead of mastering fast data cleaning and vector operations.

In actual production environments, **data wrangling and cleaning consumes 70-80% of a Data Scientist's time.**

Here is the essential quick reference guide to master Pandas and NumPy in under 10 minutes.

---

### 1. NumPy: Vectorization Over Loops

Never write Python \`for\` loops over numerical arrays. NumPy executes operations in compiled C under the hood, running **50x to 100x faster**.

\`\`\`python
import numpy as np

# Creating Arrays
arr = np.array([10, 20, 30, 40, 50])
matrix = np.zeros((3, 3))       # 3x3 zeros
identity = np.eye(3)            # 3x3 Identity matrix
linear_space = np.linspace(0, 1, 5) # 5 evenly spaced numbers

# Vectorized Math (No loops!)
squared = arr ** 2              # [100, 400, 900, 1600, 2500]
filtered = arr[arr > 25]        # [30, 40, 50] (Boolean masking)

# Matrix Multiplication
A = np.random.rand(2, 3)
B = np.random.rand(3, 2)
C = np.dot(A, B)                # Matrix dot product (2x2)
\`\`\`

---

### 2. Pandas: The 5 Operations You Run Every Day

\`\`\`python
import pandas as pd

# Load CSV Dataset
df = pd.read_csv('students_placement_data.csv')

# 1. Quick Inspection
print(df.shape)                 # (rows, columns)
print(df.info())                  # Data types & non-null counts
print(df.describe())              # Mean, std, quartiles

# 2. Filtering with Multiple Conditions
# Find CS students with CGPA > 8.5 who got placed
placed_toppers = df[(df['department'] == 'CSE') & (df['cgpa'] > 8.5)]

# 3. Handling Missing Data (Imputation)
df['cgpa'] = df['cgpa'].fillna(df['cgpa'].median())
df.dropna(subset=['email'], inplace=True)

# 4. GroupBy Aggregations
# Average package offered per department
dept_packages = df.groupby('department')['package_lpa'].agg(['mean', 'max', 'count'])
print(dept_packages)

# 5. Feature Engineering
# Create a new binary target column
df['high_package'] = df['package_lpa'].apply(lambda x: 1 if x >= 12 else 0)
\`\`\`

---

### 3. Merging & Combining Datasets Like a Pro

Understanding \`merge\` in Pandas is equivalent to mastering SQL joins:

\`\`\`python
# Inner Join: Only records present in both frames
merged_df = pd.merge(students_df, placements_df, on='student_id', how='inner')

# Left Join: Keep all students even if they do not have a placement record yet
full_status = pd.merge(students_df, placements_df, on='student_id', how='left')
\`\`\`

---

### Summary Checklist for Aspiring Data Scientists
- Always check \`df.isnull().sum()\` before doing any machine learning.
- Avoid chaining indexing like \`df['col'][0] = 5\`; always use \`df.loc[0, 'col'] = 5\` to prevent \`SettingWithCopyWarning\`.
- Use \`.astype('category')\` on text columns with repeated values (e.g., states, gender, department) to reduce RAM usage by up to 80%!
`,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Siddharth (Code Decoded)",
      role: "Lead Educator & Software Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
    },
    publishedAt: "2026-10-27",
    readingTimeMinutes: 7,
    tags: ["Data Science", "Python", "Pandas", "NumPy"],
    viewsCount: 16400
  }
];
