$path = ".\main.js"
$content = Get-Content -Raw -Encoding UTF8 $path

$content = $content.Replace(
    '{ name: "Bolas De Yuca (Yukka Ball)", price: 3.99, desc: "", img: "/latin_spot_logo_1775676211516.png" }',
    '{ name: "Bolas De Yuca (Yukka Ball)", price: 3.99, desc: "", img: "/menu/Bolas De Yuca (Yukka Ball).jpg" }'
)

$content = $content.Replace(
    '{ name: "Lunch Specials", price: 18.00, desc: "Includes rice. Call the store to see what’s the lunch special", img: "/latin_spot_logo_1775676211516.png" }',
    '{ name: "Lunch Specials", price: 18.00, desc: "Includes rice. Call the store to see what’s the lunch special", img: "/menu/Lunch Specials.jpg" }'
)

$content = $content.Replace(
    '{ name: "Fritura", price: 30.00, desc: "", img: "/latin_spot_logo_1775676211516.png" }',
    '{ name: "Fritura", price: 30.00, desc: "", img: "/menu/Fritura.jpg" }'
)

$content = $content.Replace(
    '{ name: "Papas Locas", price: 15.99, desc: "Salchichas, ketchup, mayonesa y papas fritas", img: "/latin_spot_logo_1775676211516.png" }',
    '{ name: "Papas Locas", price: 15.99, desc: "Salchichas, ketchup, mayonesa y papas fritas", img: "/menu/Papas Locas.jpg" }'
)

Set-Content -Path $path -Value $content -Encoding UTF8
