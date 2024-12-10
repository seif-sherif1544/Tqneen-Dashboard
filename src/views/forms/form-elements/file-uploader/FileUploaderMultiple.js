// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FormHelperText, FormLabel } from '@mui/material'
import FallbackSpinner from 'src/@core/components/spinner'
import { LoaderIcon } from 'react-hot-toast'
import { GridLoadingOverlay } from '@mui/x-data-grid'
import { width } from '@mui/system'

const FileUploaderMultiple = ({ onUploadCallback, name, helperText, error, label, defaultValues, setFiles, files }) => {
  // ** State

  const [loading, setLoading] = useState(false)

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async acceptedFiles => {
      setLoading(true)
      setFiles(acceptedFiles?.map(file => Object.assign(file)))
      try {
        await onUploadCallback(name, acceptedFiles)
      } catch (e) { }
      setLoading(false)
    }
  })

  const renderFilePreview = file => {
    if (file?.src) {
      return <img width={38} height={38} alt={file.src} src={file.src} />
    }
    else if (file?.type?.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles?.filter(i => i?.name !== file?.name)
    setFiles([...filtered])
    onUploadCallback(name, [...filtered])

  }

  const fileList = files?.map(file => (
    <ListItem key={file?.name ?? file?.src}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          {file?.name && <Typography className='file-name'>{file.name}</Typography>}
          {file?.size && <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>}
        </div>
      </div>
      {/* <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton> */}
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
    onUploadCallback(name, [])

  }


  return (
    <Fragment>
      {label && <FormLabel sx={{
        textAlign: 'center'
      }}>{label}</FormLabel>}
      {loading ? <LoaderIcon style={{ width: 50, height: 50, margin: "auto" }} /> : <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {files?.length ? (
          <Fragment>
            <List>{fileList}</List>
            {/* <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button variant='contained'>Upload Files</Button>
          </div> */}
          </Fragment>
        ) : null}
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }} >
          <Box
            sx={{
              mb: 8.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
            }}
          >
            <Icon icon='tabler:upload' fontSize='1.75rem' />
          </Box>
        </Box>

        {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </div>}


    </Fragment>
  )
}

export default FileUploaderMultiple
