import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
    try {
        // 1. Capturar el token de autenticación obligatorio
        const token = core.getInput('github-token', { required: true });
        const octokit = github.getOctokit(token);

        // 2. Extraer datos del contexto del webhook de GitHub
        const contexto = github.context;

        if (!contexto.payload.issue) {
            core.setFailed('Este flujo no se disparó desde un Issue.');
            return;
        }

        const numeroIssue = contexto.payload.issue.number;
        const usuarioIssue = contexto.payload.issue.user.login;
        const propietario = contexto.repo.owner;
        const repositorio = contexto.repo.repo;

        // 3. Crear el mensaje personalizado
        const comentario = `¡Hola @${usuarioIssue}! 👋 Muchas gracias por abrir este issue. El equipo técnico lo revisará lo antes posible.`;

        core.info(`Publicando saludo para @${usuarioIssue} en el issue #${numeroIssue}...`);

        // 4. Enviar el comentario a la API de GitHub
        await octokit.rest.issues.createComment({
            owner: propietario,
            repo: repositorio,
            issue_number: numeroIssue,
            body: comentario,
        });

        core.info('¡Comentario enviado con éxito!');

    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Error en la ejecución: ${error.message}`);
        } else {
            core.setFailed('Ocurrió un error desconocido durante la ejecución de la acción.');
        }
    }
}

run();