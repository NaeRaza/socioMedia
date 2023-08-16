const Role = require('../models/Role')

//Create
const createRole = async(req, res) =>{
    try{
        const { roles, level } = req.body

        const newRole = new Role({
            roles,
            level
        })

        const savedRole = await newRole.save()
        res.status(201).json(savedRole)

    }catch(err){
        res.status(500).json({err: err.message})
    }
}

//update
const updateRole = async(req, res)=> {
    const {id} = req.params
    try{
        const editRole = await Role.findByIdAndUpdate(id)

        if(!editRole){
            return res.status(404).json({message: "Rôle introuvable"})
        }

        if (req.body.roles) {
            editRole.roles = req.body.roles;
          }
          if (req.body.level) {
            editRole.level = req.body.level;
          }

          await editRole.save();
          res.status(200).json({message: "Le rôle a été mis à jour avec succès"});

    }catch(err){
        res.status(500).json({err: err.message})
    }
}

//Delete
const deleteRole = async(req, res)=>{
    const {id} = req.params
    try{
        const delRole = await Role.findByIdAndDelete(id)

        if(!delRole){
            return res.status(404).json({message: "Rôle introuvable"})
        }
        res.status(200).json({message: "Rôle supprimmé avec succès"})

    }catch(err){
        res.status(500).json({err: err.message})
    }
}

module.exports = {
    createRole,
    updateRole,
    deleteRole
}