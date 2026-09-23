export const initialRows = {
    vagas: [
        { id: 'mentoria', name: 'Mentoria de carreira', mode: 'Remoto', count: 12, status: 'Aberta' },
        {
            id: 'organizacao',
            name: 'Organização de evento',
            mode: 'Presencial',
            count: 8,
            status: 'Aberta',
        },
        { id: 'reforco', name: 'Aulas de reforço', mode: 'Presencial', count: 15, status: 'Encerrada' },
        { id: 'design', name: 'Design para redes sociais', mode: 'Remoto', count: 5, status: 'Aberta' },
    ],
    voluntarios: [
        { id: 'ana', name: 'Ana Silva', interest: 'Educação', availability: 'Tardes', status: 'Ativo' },
        {
            id: 'carlos',
            name: 'Carlos Souza',
            interest: 'Gestão',
            availability: 'Fins de semana',
            status: 'Ativo',
        },
        {
            id: 'maria',
            name: 'Maria Santos',
            interest: 'Comunicação',
            availability: 'Flexível',
            status: 'Pendente',
        },
        {
            id: 'joao',
            name: 'João Oliveira',
            interest: 'Tecnologia',
            availability: 'Noites',
            status: 'Inativo',
        },
    ],
    eventos: [
        {
            id: 'mutirao',
            name: 'Mutirão de arrecadação',
            date: '2026-10-25',
            capacity: 60,
            count: 42,
            status: 'Aberto',
        },
        {
            id: 'workshop',
            name: 'Workshop de primeiros socorros',
            date: '2026-11-15',
            capacity: 30,
            count: 12,
            status: 'Aberto',
        },
        {
            id: 'feira',
            name: 'Feira de saúde comunitária',
            date: '2026-12-10',
            capacity: 100,
            count: 0,
            status: 'Rascunho',
        },
    ],
    doacoes: [
        {
            id: 'ana',
            name: 'Ana Silva',
            type: 'Financeira',
            value: 500,
            project: 'Biblioteca de bairro',
            date: '2026-09-10',
            status: 'Confirmada',
        },
        {
            id: 'carlos',
            name: 'Carlos Souza',
            type: 'Financeira',
            value: 250,
            project: 'Cozinha solidária',
            date: '2026-09-15',
            status: 'Confirmada',
        },
        {
            id: 'maria',
            name: 'Maria Santos',
            type: 'Itens',
            value: '50 livros',
            project: 'Biblioteca de bairro',
            date: '2026-09-20',
            status: 'Recebida',
        },
        {
            id: 'empresa',
            name: 'Empresa XYZ',
            type: 'Financeira',
            value: 2000,
            project: 'Saúde na comunidade',
            date: '2026-09-25',
            status: 'Pendente',
        },
    ],
    prestacao: [
        {
            id: 'livros',
            name: 'Compra de livros',
            project: 'Biblioteca de bairro',
            type: 'Despesa',
            value: 3200,
            date: '2026-09-05',
            status: 'Aprovado',
        },
        {
            id: 'empresa',
            name: 'Doação Empresa XYZ',
            project: 'Cozinha solidária',
            type: 'Receita',
            value: 2000,
            date: '2026-09-10',
            status: 'Aprovado',
        },
        {
            id: 'aluguel',
            name: 'Aluguel de espaço',
            project: 'Saúde na comunidade',
            type: 'Despesa',
            value: 1500,
            date: '2026-09-15',
            status: 'Pendente',
        },
        {
            id: 'material',
            name: 'Material didático',
            project: 'Biblioteca de bairro',
            type: 'Despesa',
            value: 800,
            date: '2026-09-20',
            status: 'Em análise',
        },
    ],
    documentos: [
        { id: 'estatuto', name: 'Estatuto social', type: 'Estatuto', date: '', status: '' },
        { id: 'ata', name: 'Ata de eleição da diretoria', type: 'Ata', date: '2027-03-15', status: '' },
        { id: 'cnpj', name: 'Certidão CNPJ', type: 'Certidão', date: '2026-12-20', status: '' },
        { id: 'cebas', name: 'Certificado CEBAS', type: 'Certificado', date: '2026-06-30', status: '' },
        { id: 'relatorio', name: 'Relatório anual 2025', type: 'Relatório', date: '', status: '' },
    ],
};
export const columns = {
    vagas: [
        ['name', 'Vaga'],
        ['mode', 'Modalidade'],
        ['count', 'Inscritos'],
        ['status', 'Status'],
        ['actions', 'Ações'],
    ],
    voluntarios: [
        ['name', 'Voluntário'],
        ['interest', 'Interesse'],
        ['availability', 'Disponibilidade'],
        ['status', 'Status'],
        ['actions', 'Ações'],
    ],
    eventos: [
        ['name', 'Evento'],
        ['date', 'Data'],
        ['capacity', 'Vagas'],
        ['count', 'Inscritos'],
        ['status', 'Status'],
        ['actions', 'Ações'],
    ],
    doacoes: [
        ['name', 'Origem'],
        ['type', 'Tipo'],
        ['value', 'Valor/Item'],
        ['project', 'Destino'],
        ['date', 'Data'],
        ['status', 'Status'],
    ],
    prestacao: [
        ['name', 'Lançamento'],
        ['project', 'Projeto'],
        ['type', 'Tipo'],
        ['value', 'Valor'],
        ['date', 'Data'],
        ['status', 'Situação'],
    ],
    documentos: [
        ['name', 'Documento'],
        ['date', 'Vencimento'],
        ['status', 'Status'],
        ['actions', 'Ação'],
    ],
};
export function documentStatus(date, now = new Date()) {
    if (!date)
        return 'Válido';
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expiry = new Date(date + 'T00:00:00');
    const limit = new Date(today);
    limit.setDate(limit.getDate() + 90);
    return expiry < today ? 'Vencido' : expiry < limit ? 'Vencendo' : 'Válido';
}
export const months = ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];
export const revenue = [3100, 5200, 4500, 7800, 8900, 11200];
export function money(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}
export function parseMoney(value) {
    return Number(value.replace(/\./g, '').replace(',', '.'));
}
export function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
export function csvCell(value) {
    let text = String(value ?? '');
    if (/^[=+@\-\t\r]/.test(text))
        text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
}
/** Preserve the activity records already collected by the public forms. */
export function activityRows(records) {
    return records.map((record) => {
        const fields = record.fields;
        const raw = (fields['Valor'] || fields['Valor da doacao'] || '').replace(/[^\d.,]/g, '');
        const amount = raw.includes(',') ? parseMoney(raw) : Number(raw);
        return {
            id: record.id,
            name: record.type === 'doacao'
                ? record.ownerName || fields['Dados do doador'] || 'Visitante'
                : fields['Descricao'] || record.pageTitle,
            type: fields['Tipo de doacao'] ||
                fields['Tipo de lancamento'] ||
                (record.type === 'doacao' ? 'Financeira' : 'Receita'),
            value: raw && Number.isFinite(amount) ? amount : fields['Itens'] || 'A conferir',
            project: fields['Projeto apoiado'] || fields['Projeto vinculado'] || record.pageTitle,
            date: (fields['Data'] || record.createdAt).slice(0, 10),
            status: record.status,
        };
    });
}
