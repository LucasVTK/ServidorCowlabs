
const demandasController = {
  async filterDemandas(req, res) {
    const demandasFiltradas = req.demandasFiltradas
    return res.status(200).json({
      total: demandasFiltradas.length,
      items: demandasFiltradas
    })
}
}

export default demandasController
