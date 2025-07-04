import React, { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, Badge, Button, Dialog, DialogContent,
  DialogTitle, Box, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";

const API_URL = "https://exercise-app-backend-beryl.vercel.app/api"; // 실제 배포 주소로 변경

function App() {
  const [users, setUsers] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [file, setFile] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(setUsers);
  }, [snack.open]);

  const handleUpload = async () => {
    if (!userId || !file) {
      setSnack({ open: true, msg: "ID와 이미지를 선택하세요.", severity: "warning" });
      return;
    }
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("image", file);
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      setSnack({ open: true, msg: "인증 완료!", severity: "success" });
      setFile(null);
    } else {
      setSnack({ open: true, msg: data.error || "에러 발생", severity: "error" });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        운동 인증 현황
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>오늘 인증하기</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>ID 선택</InputLabel>
          <Select
            value={userId}
            label="ID 선택"
            onChange={e => setUserId(e.target.value)}
          >
            {users.map(u => (
              <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
          style={{ marginBottom: 8 }}
        />
        <Button variant="contained" onClick={handleUpload} fullWidth>
          인증 업로드
        </Button>
      </Paper>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="center">이번 주 인증</TableCell>
              <TableCell align="center">최근 인증 사진</TableCell>
              <TableCell align="center">경고</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.username}</TableCell>
                <TableCell align="center">{u.weekCount || 0}/7</TableCell>
                <TableCell align="center">
                  {u.thumbUrl &&
                    <Avatar
                      src={`https://[supabase-project].supabase.co/storage/v1/object/public/exercise-images/${u.thumbUrl}`}
                      sx={{ width: 48, height: 48, cursor: "pointer", mx: "auto" }}
                      onClick={() => { setSelectedImg(`https://[supabase-project].supabase.co/storage/v1/object/public/exercise-images/${u.imageUrl}`); setOpen(true); }}
                      variant="rounded"
                    />
                  }
                </TableCell>
                <TableCell align="center">
                  {u.weekCount < 3 &&
                    <Badge badgeContent={u.warningCount} color="error">
                      <Typography color="error" fontWeight="bold">⚠️</Typography>
                    </Badge>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>원본 사진</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center" }}>
            <img src={selectedImg} alt="원본" style={{ maxWidth: "100%" }} />
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar open={snack.open} autoHideDuration={2000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
