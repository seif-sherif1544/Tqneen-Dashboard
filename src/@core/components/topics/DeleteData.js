import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import { Box } from '@mui/system'



const DeleteData = ({ open, onClose, text, title, fetchData, deleteSubmit, isDeleting }) => {



  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 554 } }}
            >
              <DialogTitle
                id='user-view-edit'
                sx={{
                  // textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1.5rem !important',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                  pb: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(4)} !important`],
                  borderBottom: '0.5px solid #DEDEDE',
                  color: "#000"
                }}
              >
                {title}
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => onClose()}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' color="#BA1F1F" />
                </IconButton>
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(6)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`],

                }}
              >
                <Grid container spacing={2} sx={{
                  my: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
                  display: 'flex', justifyContent: 'center'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                    <Typography variant="h1" sx={{ fontSize: '24px', fontWeight: 400, textAlign: 'center', color: '#000' }}>{text}</Typography>
                  </Box>
                </Grid>
                <DialogActions
                  sx={{
                    justifyContent: 'center',
                    gap: '1rem',

                    // pl: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    p: 0,

                    // pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                    mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(7)} !important`]
                  }}
                >
                  <Button variant="outlined" type='button' onClick={onClose} sx={{
                    color: "#0D0E10",
                    borderColor: "#DCDCDC",
                    py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`],
                    "&:hover": {
                      color: "#0D0E10",
                      borderColor: "#DCDCDC",
                    }
                  }}>Cancel</Button>
                  <Button
                    variant='contained'
                    sx={{
                      border: '1px solid #BA1F1F',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: 400,
                      textAlign: 'center',
                      color: '#fff',
                      backgroundColor: '#BA1F1F',
                      py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(2.6)} !important`],
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(5.5)} !important`],
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#BA1F1F'
                      },
                    }}
                    type='submit'
                    onClick={deleteSubmit}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span>Deleting...</span>
                        <span>
                          <CircularProgress size={20} />
                        </span>
                      </>
                    ) : (
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        '&:hover': {
                          color: '#BA1F1F'
                        }
                      }}>
                        <Icon icon='tabler:trash' />
                        <Typography sx={{
                          color: '#fff',
                          '&:hover': {
                            color: '#BA1F1F'
                          }
                        }}>Delete</Typography>
                      </Box>
                    )}
                  </Button>

                </DialogActions>
              </DialogContent>


            </Dialog>
          </Card>
        </Grid>
      </Grid>


    </>
  )
}

export default DeleteData
