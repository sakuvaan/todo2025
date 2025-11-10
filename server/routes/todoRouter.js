import { auth } from '../helper/auth.js'
import { Router } from 'express'
import { pool } from '../helper/db.js'
import { getTasks } from '../controllers/TaskController.js'

const router = Router()

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM task', (err, result) => {
    if (err) {
      return next(err)
    }
    res.status(200).json(result.rows || [])
  })
})

router.post('/create', auth, (req, res, next) => {
  const { task } = req.body
  if (!task) {
    return res.status(400).json({ error: 'Task is required' })
  }

  pool.query('insert into task (description) values ($1) returning *', [task.description],
    (err, result) => {
      if (err) {
        return next(err)
      }
      res.status(201).json({ id: result.rows[0].id, description: task.description })
    })
})

router.delete('/delete/:id', auth, (req, res, next) => {
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
