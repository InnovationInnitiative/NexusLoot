import fs from 'fs';
import path from 'path';

// Define the games we want to target
const games = [
    { id: 'valorant', name: 'Valorant' },
    { id: 'cs2', name: 'CS2' },
    { id: 'apex-legends', name: 'Apex Legends' },
    { id: 'overwatch-2', name: 'Overwatch 2' },
    { id: 'rainbow-six-siege', name: 'Rainbow Six Siege' },
    { id: 'fortnite', name: 'Fortnite' },
    { id: 'call-of-duty', name: 'Call of Duty' }
];

const blogDir = './blog';

// HTML Template for the blog posts
const template = (source, target) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>How to Convert ${source.name} Sensitivity to ${target.name} | NexusLoot</title>
    <meta name="description" content="Learn the exact math and multiplier to convert your ${source.name} sensitivity to ${target.name}. Use our free, instant calculator to keep your muscle memory intact.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../style.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lexend:wght@700;800&display=swap');
        body { background-color: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; }
        .prose h2 { font-family: 'Lexend', sans-serif; color: #fff; font-size: 2rem; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1rem; }
        .prose p { color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 1.5rem; font-size: 1.1rem; }
        .prose ul { color: rgba(255,255,255,0.7); list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; }
        .prose strong { color: #66fcf1; }
    </style>
</head>
<body>
    <nav class="sticky top-0 z-50 bg-nexus-dark/90 backdrop-blur-md border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="../index.html" class="flex items-center gap-3 cursor-pointer">
                    <i class="fa-solid fa-bolt-lightning text-epic text-2xl drop-shadow-[0_0_8px_#8B5CF6]"></i>
                    <span class="font-display text-xl tracking-tighter italic uppercase text-white">Nexus<span class="text-epic">Loot</span> // Blog</span>
                </a>
                <a href="index.html" class="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">← Back to Articles</a>
            </div>
        </div>
    </nav>

    <main class="max-w-3xl mx-auto px-4 py-16">
        <div class="mb-12">
            <div class="flex items-center gap-4 mb-6">
                <span class="text-[8px] font-bold text-neon-cyan uppercase tracking-widest border border-neon-cyan/20 px-3 py-1 rounded-full bg-neon-cyan/5">Sensitivity Guides</span>
                <span class="text-[10px] text-white/30 font-mono">Published: June 1, 2026</span>
            </div>
            <h1 class="font-display text-5xl uppercase tracking-tighter italic text-white leading-tight">How to Convert ${source.name} Sensitivity to ${target.name}</h1>
        </div>

        <div class="prose">
            <p>Switching your main game from ${source.name} to ${target.name}? The worst thing you can do is guess your sensitivity. Both games run on entirely different engines with different field-of-view (FOV) scaling, meaning your muscle memory will be completely thrown off if you don't convert it mathematically.</p>

            <h2>Why You Must Convert Your Sens</h2>
            <p>Professional aimers rely on "cm/360" (the physical distance your mouse moves on the pad to perform a full 360-degree turn in-game). To maintain the exact same cm/360 from ${source.name} in ${target.name}, a specific multiplier must be applied to your raw sensitivity number.</p>

            <h2>Use the Free NexusLoot Sens Converter</h2>
            <p>Instead of digging for spreadsheets and calculating the ratio manually, we built a 100% free, client-side calculator right here on NexusLoot. It does the math instantly and even includes a visual <strong>Crosshair Studio</strong>.</p>
            
            <div class="bg-[#1f2833] p-8 rounded-3xl border border-white/5 my-8 text-center">
                <h3 class="font-display text-2xl uppercase tracking-tighter text-white mb-4">Instantly Convert to ${target.name}</h3>
                <p class="text-white/50 mb-6 text-sm">Select ${source.name} as your source, type in your sens, and instantly get your exact ${target.name} sensitivity.</p>
                <a href="../index.html" class="inline-block py-4 px-8 bg-neon-cyan text-arcade-bg font-black rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(102,252,241,0.3)] hover:scale-[1.05] transition-all">Launch Sens Converter</a>
            </div>

            <h2>What about Crosshairs?</h2>
            <p>Every game scales crosshairs differently. A "length 4" crosshair in one game might look massive in another. Our <strong>Crosshair Studio</strong> (inside the Sens Converter tab) allows you to visually recreate your ${source.name} crosshair on an HTML canvas.</p>
            <p>Once you are happy with how it looks, you can generate copy-pasteable configuration codes for major titles instantly.</p>
        </div>
    </main>

    <footer class="border-t border-white/5 py-16 mt-32 bg-black/40 text-center">
        <div class="max-w-7xl mx-auto px-4">
            <h4 class="font-display text-lg mb-4 italic uppercase">NEXUS<span class="text-epic">LOOT</span></h4>
            <p class="text-[9px] text-white/20 uppercase tracking-[0.2em]">© 2026 Innovation Initiative Hub</p>
        </div>
    </footer>
</body>
</html>`;

// Index Page Template
const indexTemplate = (linksHtml) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusLoot Intelligence // Gaming SEO Hub</title>
    <meta name="description" content="Discover the latest gaming strategies, sensitivity conversion guides, and free loot updates from the NexusLoot AI system.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../style.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lexend:wght@700;800&display=swap');
        body { background-color: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; }
    </style>
</head>
<body>
    <nav class="sticky top-0 z-50 bg-nexus-dark/90 backdrop-blur-md border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="../index.html" class="flex items-center gap-3 cursor-pointer">
                    <i class="fa-solid fa-bolt-lightning text-epic text-2xl drop-shadow-[0_0_8px_#8B5CF6]"></i>
                    <span class="font-display text-xl tracking-tighter italic uppercase text-white">Nexus<span class="text-epic">Loot</span> // Blog</span>
                </a>
                <a href="../index.html" class="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">← Back to Dashboard</a>
            </div>
        </div>
    </nav>

    <main class="max-w-5xl mx-auto px-4 py-12">
        <div class="text-center mb-16">
            <h1 class="font-display text-5xl uppercase tracking-tighter italic text-white mb-4">Neural <span class="text-neon-cyan">Archives</span></h1>
            <p class="text-white/40 uppercase tracking-[0.3em] text-xs">Automated SEO Intelligence Feed</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${linksHtml}
        </div>
    </main>

    <footer class="border-t border-white/5 py-16 mt-32 bg-black/40 text-center">
        <div class="max-w-7xl mx-auto px-4">
            <h4 class="font-display text-lg mb-4 italic uppercase">NEXUS<span class="text-epic">LOOT</span></h4>
            <p class="text-[9px] text-white/20 uppercase tracking-[0.2em]">© 2026 Innovation Initiative Hub</p>
        </div>
    </footer>
</body>
</html>`;

async function generateBlogs() {
    console.log("Generating SEO Blog Pages...");
    
    let linksHtml = '';
    let count = 0;

    for (let i = 0; i < games.length; i++) {
        for (let j = 0; j < games.length; j++) {
            if (i === j) continue; // Don't convert a game to itself

            const source = games[i];
            const target = games[j];
            const fileName = `${source.id}-to-${target.id}-sens-converter.html`;
            const filePath = path.join(blogDir, fileName);

            // Generate HTML Content
            const htmlContent = template(source, target);

            // Write to file
            fs.writeFileSync(filePath, htmlContent);

            // Create Link for Index
            linksHtml += `
            <a href="${fileName}" class="glass-card bg-[#1f2833] rounded-2xl p-6 border border-white/5 hover:border-neon-cyan/50 transition-all group block">
                <div class="flex items-center gap-4 mb-3">
                    <span class="text-[8px] font-bold text-neon-cyan uppercase tracking-widest border border-neon-cyan/20 px-2 py-1 rounded-full bg-neon-cyan/5">Sens Guide</span>
                </div>
                <h2 class="font-display text-xl uppercase tracking-tighter mb-2 group-hover:text-neon-cyan transition-colors text-white">Convert ${source.name} to ${target.name} Sens</h2>
                <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:pl-2 group-hover:text-white transition-all">Read Guide →</span>
            </a>`;
            
            count++;
        }
    }

    // Write the index.html file
    const indexPath = path.join(blogDir, 'index.html');
    fs.writeFileSync(indexPath, indexTemplate(linksHtml));

    console.log(`✅ Successfully generated ${count} SEO articles and updated the blog index.`);
}

generateBlogs();