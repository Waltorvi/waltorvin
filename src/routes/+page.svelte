<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { afterUpdate } from 'svelte';

    import { focusTerminal } from "$lib/stores";

    // Функцция для прокртик страницы вниз, когда появляются новые линии и переполнено
    afterUpdate(() => {
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    });

    type HistoryLine = {
        id: number;
        text: string;
        isCommand?: boolean; // Чтобы команды можно было стилизовать иначе
    };

    let inputRef: HTMLInputElement;
    let command = ''; // Текущая введенная команда
    let history: HistoryLine[] = [];
    let historyIndex = 0;

    // Функция помощник, чтобы создать эффект печати
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    async function handleCommand() {
        if (!command.trim()) return;
        command = command.replace('/', '')

        addHistoryLine(command, true);

        const userCommand = command.toLowerCase();
        command = ''; // Очищаем инпут мгновенно, чтобы пользователь мог печатать дальше

            // help
        if (userCommand === 'help') {
            await typeResponse('Помощь? Милый, я сам её ищу...')
            await sleep(31) // Идеально для того, чтобы убрать текст до того, как он появится
            history = history
            history.pop()
            await typeResponse('Доступные команды: [about], [socials], [clear]. Но они появятся чуть позже, дорогуша!');
        }

            // rarity
        else if (userCommand === 'rarity') {
            await typeResponse('тут будет че та да')

            // socials
        } else if (userCommand === 'socials') {
            await typeResponse('<b style="color: #2a7fa3">Telegram</b>: @Waltorvi<br><b style="color: #325aa8">Twitter</b>: @Waltorvi' +
                '<br><b style="color: #97273c">Email</b>: some@mail.com')

            // clear
        } else if (userCommand === 'clear') {
            history = [];

            // whoami
        } else if (userCommand === 'whoami') {
            await typeResponse('Самый лучший человек на свете ✨')

            // exit / quit
        } else if (userCommand === 'exit' || userCommand == 'quit') {
            await typeResponse('Ты так просто отсюда не уйдешь, дорогуша 😘')
        } else {
            await typeResponse(`Неизвестная команда: "${userCommand}". Попробуй 'help'.`);
        }
    }

    function addHistoryLine(text: string, isCommand = false) {
        history = [...history, { id: historyIndex++, text, isCommand }];
    }

    async function typeResponse(text: string, isHtml = false) {
        addHistoryLine(isHtml ? text : '');

        const lastLine = history[history.length - 1];
        let tag = ''; // Сюда храним html Теги
        let tag_flag = false
        let skipped = 0 // Чтобы написание текста не ускорялось от html тегов
        if (isHtml) {
            await sleep(100);
            history = history
        } else {
            for (let i = 0; i < text.length; i++) {
                console.log(tag_flag, tag)
                if (text.charAt(i) === '<') {
                    tag_flag = true
                    tag += text.charAt(i)
                    skipped += 1
                    continue
                }
                if (text.charAt(i) === '>') {
                    tag_flag = false
                    tag += text.charAt(i)
                    lastLine.text += tag
                    tag = ''
                    skipped += 1
                    history = history
                    continue
                }
                if (tag_flag) {
                    tag += text.charAt(i)
                    skipped += 1
                    continue
                }

                lastLine.text += text.charAt(i);
                history = history;
                const sleep_time = 15 - (i-skipped)/100
                console.log(sleep_time)
                await sleep(sleep_time);
            }
        }
        history = history;
    }


    // Функция, чтобы клик по любому месту окна ставил фокус в инпут
    function focusInput() {
        inputRef.focus();
    }

    onMount(() => {
        typeResponse('Welcome to Waltorvi OS. Type `help` for inspiration, darling. ✨');

        focusTerminal.set(focusInput)

        inputRef.focus();
    });
</script>


<div class="terminal-content">
    {#each history as line (line.id)}
        <div class="line" in:fade={{ duration: 300, delay: 50 }}>
            {#if line.isCommand}
                <span class="prompt">waltorvi@space:~$</span>
            {/if}
            <span>{@html line.text}</span>
        </div>
    {/each}

    <div class="input-line">
        <span class="prompt">waltorvi@space:~$</span>
        <form on:submit|preventDefault={handleCommand} class="input-form">
            <input
                    type="text"
                    bind:this={inputRef}
                    bind:value={command}
                    spellcheck="false"
                    autocomplete="off"
            />
        </form>
    </div>
</div>

<style>
    .terminal-content {
        width: 100%;
        height: 100%;
    }
    .line {
        line-height: 1.5;
        white-space: pre-line;
        word-wrap: break-word;
        text-wrap: pretty;
    }
    .input-line .prompt {
        color: var(--prompt);
        margin-right: 8px;
        font-weight: bold;
    }
    .prompt {
        color: var(--prompt);
        margin-right: 0;
        font-weight: bold;
    }
    .input-line {
        display: flex;
        align-items: center;
    }
    .input-form {
        flex: 1;
    }
    input {
        background: transparent;
        border: none;
        outline: none;
        color: var(--foreground);
        font-family: var(--font);
        font-size: 1em;
        width: 100%;
    }
    @keyframes blink {
        from,
        to {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }
</style>