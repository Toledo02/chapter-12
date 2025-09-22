*** Settings ***
Documentation   Calcular dosagem para diferentes culturas
Resource        ../resources/calcular_dosagem_page.resource
Test Setup      Abrir a Página
Test Teardown   Take Screenshot

*** Test Cases ***
Calcular dosagem de Soja
    Selecionar área
    Selecionar Soja
    Calcular Dosagem
    Validar cálculo de Soja

Calcular dosagem de Milho
    Selecionar área
    Selecionar Milho
    Calcular Dosagem
    Validar cálculo de Milho

Calcular dosagem de Trigo
    Selecionar área
    Selecionar Trigo
    Calcular Dosagem
    Validar cálculo de Trigo

Calcular dosagem com área inválida
    Selecionar área inválida
    Selecionar Trigo
    Calcular Dosagem inválida
    Validar área inválida

Calcular dosagem com cultura inválida
    Selecionar área
    Calcular Dosagem inválida
    Validar cultura inválida