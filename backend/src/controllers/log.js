import db from '../config/db.js';

/**
 * Registra um log no banco de dados.
 * @param {*} obj - Objeto contendo os dados do log.
 * @returns
 */
export async function registerLog(obj) {
    try {
        const sql = "INSERT INTO logs (usuario, acao, recurso_afetado, id_recurso_afetado, valor_antigo, valor_novo, campos_alterados, ip, status_acao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [rows] = db.query(sql, [
            obj.usuario,
            obj.acao,
            obj.recurso_afetado,
            obj.id_recurso_afetado,
            obj.valor_antigo,
            obj.valor_novo,
            obj.campos_alterados,
            obj.ip,
            obj.status_acao
        ]);

        if (rows.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                message: 'Logs registrados com sucesso'
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Falha ao registrar os logs'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ocorreu um erro ao registrar os logs'
        });
    }
}