*** Settings ***
Documentation    Página para cálculo de dosagem
Library          Browser
Variables        ../variables/calcular_dosagem_page.yml


*** Keywords ***
Abrir a Página
    New Browser    headless=False     browser=chromium    args=["-start-maximized"]
    New Context    viewport=${None}
    New Page    ${url}
    Wait For Elements State    css=${title}    visible    10
    Get Text    css=${title}    contains    Dosagem de Insumos

Selecionar área
    Fill Text    id=${area}    100

Selecionar Soja
    Click    id=${cultura}
    Press Keys    id=${cultura}    ArrowDown    Enter

Selecionar Milho
    Click    id=${cultura}
    Press Keys    id=${cultura}    ArrowDown    ArrowDown    Enter

Selecionar Trigo
    Click    id=${cultura}
    Press Keys    id=${cultura}    ArrowDown    ArrowDown    ArrowDown    Enter

Calcular Dosagem
    Click    id=${calcular}
    Wait For Elements State    id=${mensagem}    visible    5
    Get Text    id=${mensagem}    contains    Sucesso

Validar cálculo de Soja
    Get Text    id=${mensagem}    contains    1000 litros

Validar cálculo de Milho
    Get Text    id=${mensagem}    contains    1250 litros

Validar cálculo de Trigo
    Get Text    id=${mensagem}    contains    900 litros