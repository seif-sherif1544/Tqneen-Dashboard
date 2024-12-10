import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import { Box } from '@mui/system'

const DeleteModal = ({ isSubmitting, open, onClose, text, title, handleDelete, errorDelete }) => {



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
                  borderBottom: '0.5px solid #646569',
                  color: "#000"
                }}
              >
                {title}
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => onClose()}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' />
                </IconButton>
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`],

                }}
              >
                <Grid container spacing={2} sx={{
                  my: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(12)} !important`],
                  display: 'flex', justifyContent: 'center'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                    <Typography variant="h1" sx={{ fontSize: '24px', fontWeight: 400, textAlign: 'center', color: '#000' }}>{text}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '18px', fontWeight: 400, textAlign: 'center', color: 'red' }}>{errorDelete}</Typography>
                  </Box>
                </Grid>
                <DialogActions
                  sx={{
                    justifyContent: 'center',

                    // pl: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    p: 0,

                    // pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                    mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(7)} !important`]
                  }}
                >

                  <Button
                    variant='contained'
                    sx={{
                      border: '1px solid #BA1F1F',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: 400,
                      textAlign: 'center',
                      color: '#BA1F1F',
                      backgroundColor: 'transparent',
                      px: theme => [`${theme.spacing(6)} !important`, `${theme.spacing(12.6)} !important`],
                      py: theme => [`${theme.spacing(2.3)} !important`, `${theme.spacing(3.6)} !important`],
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#BA1F1F'
                      },
                    }}
                    type='submit'
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span>Deleting...</span>
                        <span>
                          <CircularProgress size={20} />
                        </span>
                      </>
                    ) : 'Delete'}
                  </Button>
                  <Button
                    variant='tonal'
                    sx={{
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '18px',
                      fontWeight: 700,
                      textAlign: 'center',
                      color: '#fff',
                      backgroundColor: '#BA1F1F',
                      '&:hover': {
                        backgroundColor: '#BA1F1F',
                      },
                      px: theme => [`${theme.spacing(6)} !important`, `${theme.spacing(12.6)} !important`],
                      py: theme => [`${theme.spacing(2.3)} !important`, `${theme.spacing(3.5)} !important`]
                    }}
                    type='button'
                    onClick={onClose}
                  >
                    Close
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

export default DeleteModal
