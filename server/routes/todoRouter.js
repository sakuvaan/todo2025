import { Router } from 'express'
import { pool } from '../helper/db.js'

const router = Router()

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM task', (err, result) => {
    if (err) return next(err)
    res.status(200).json(result.rows || [])
  })
})

router.post('/create', (req, res, next) => {
  const desc = req.body?.task?.description?.trim()
  if (!desc) return res.status(400).json({ error: 'Task is required' })
  pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [desc], (err, result) => {
    if (err) return next(err)
    res.status(201).json(result.rows[0])
  })
})

router.delete('/delete/:id', (req, res, next) => {
  const { id } = req.params
  pool.query('DELETE FROM task WHERE id = $1', [id], (err, result) => {
    if (err) return next(err)
    if (result.rowCount === 0) {
      const e = new Error('Task not found')
      e.status = 404
      return next(e)
    }
    res.status(200).json({ id: Number(id) })
  })
})

export default router
